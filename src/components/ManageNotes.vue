<template>
  <div class="container-fluid text-left">

    <div>
      <b-table striped hover :items="notes" :fields="fields">

        <template v-slot:cell(delete)="data">
          <b-button variant="danger" @click="deleteNote(data.item)">
            <i class="fa fa-trash" aria-hidden="true"></i>
          </b-button>
        </template>

        <template v-slot:cell(userCourseStartedNoteText)="data">
            
            <b-button v-b-toggle="'collapse-a' + data.item.userCourseStartedId" block variant="info">
                Prikaži
            </b-button>

            <b-collapse :id="'collapse-a'+data.item.userCourseStartedId">
                <div v-html="data.item.userCourseStartedNote">                                        
                </div>
            </b-collapse>
        
        </template>

      </b-table>
    </div>
    <!--
    <pagination :data="notes" @pagination-change-page="getNotes"></pagination>
    -->
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["course"],
  mixins: [],
  name: "AdminNotes",
  components: {},
  mounted() {
    this.getNotes();
  },
  data() {
    return {
      fields: [
        {
          key: "delete",
          sortable: false,
          label: "Ukloni",
        },
        {
          key: "userId.lastName",
          sortable: true,
          label: "Prezime",
        },
        {
          key: "userId.name",
          sortable: true,
          label: "Ime",
        },
        {
          key: "userId.email",
          label: "E-mail",
          sortable: true,
        },
        {
          key: "userCourseStartedNoteText",
          label: "Tekst",
          sortable: false,
          class: "try-it"
        },
      ],
      notes: {},
      note_id: '',
    };
  },
  methods: {
    deleteNote(note) {

      this.$swal({
        title: "Da li ste sigurni da želite da obrišete belešku?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        cancelButtonText: "Ne",
        confirmButtonText: "Da, obriši!",
      }).then((result) => {
        
        if (result.value) {

            let creating = this.$swal.fire({
                toast: true,
                position: "top-end",
                title: "Molimo sačekajte..",
                onBeforeOpen: () => {
                    this.$swal.showLoading();
                },
            });

            axios.delete("/notes/" + note.user_course_started_id).then(() => {
                creating.close();
                this.getNotes();
                this.$swal("Obrisana beleška!", "", "success");
            }).catch(() => {
                this.$swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "error",
                    title: "Došlo je do greške. Molimo pokušajte ponovo",
                    showConfirmButton: false,
                    timer: 4500,
                });
             });            

        }

      });

    },
    getNotes(page = 1) {
      axios.get("/notes/course/" + this.course.courseId + "?page=" + page).then((response) => {      
        console.log(response)  
        this.notes = response.data;
      });
    },
  }
};
</script>

<style>
    .try-it {
        width: 80%;
    }
</style>