<template>
  <div class="container-fluid text-left">

    <div>
      <b-table striped hover :items="notes.data" :fields="fields">

        <template v-slot:cell(delete)="data">
          <b-button variant="danger" @click="deleteNote(data.item)">
            <i class="fa fa-trash" aria-hidden="true"></i>
          </b-button>
        </template>

        <template v-slot:cell(user_course_started_note_text)="data">
            
            <b-button v-b-toggle="'collapse-a' + data.item.user_course_started_id" block variant="info">
                Prikaži
            </b-button>

            <b-collapse :id="'collapse-a'+data.item.user_course_started_id">
                <div v-html="data.item.user_course_started_note">                                        
                </div>
            </b-collapse>
        
        </template>

      </b-table>
    </div>
    <pagination :data="notes" @pagination-change-page="getNotes"></pagination>

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
          key: "user.last_name",
          sortable: true,
          label: "Prezime",
        },
        {
          key: "user.name",
          sortable: true,
          label: "Ime",
        },
        {
          key: "user.email",
          label: "E-mail",
          sortable: true,
        },
        {
          key: "user_course_started_note_text",
          label: "Tekst",
          sortable: false,
          class: "try-it"
        },
        {
          key: "delete",
          sortable: false,
          label: "Ukloni",
        }
      ],
      notes: {},
      note_id: '',
    };
  },
  methods: {
    deleteNote(note) {

      this.$swal({
        title: "Da li ste sigurni da želite da obrišete belešku?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
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

            axios.delete("/notes/admin/" + note.user_course_started_id + "/delete").then(() => {
                creating.close();
                this.getNotes();
                this.$swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: "Beleška obrisana!",
                    showConfirmButton: false,
                    timer: 4500,
                });
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
      axios.get("/notes/admin/course/" + this.course.course_id + "?page=" + page).then((response) => {      
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