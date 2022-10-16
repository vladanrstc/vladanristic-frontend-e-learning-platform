<template>
  <div class="container-fluid text-left">

    <div>
      <b-table striped hover :items="reviews.data" :fields="fields">

        <template v-slot:cell(delete)="data">
          <b-button variant="danger" @click="deleteReview(data.item)">
            <i class="fa fa-trash" aria-hidden="true"></i>
          </b-button>
        </template>

        <template v-slot:cell(user_course_started_review_text)="data">
          <div v-b-tooltip.hover.left :title="data.item.user_course_started_review_text">
            {{ data.item.user_course_started_review_text | shorten }}
          </div>
        </template>

      </b-table>
    </div>
    <pagination :data="reviews" @pagination-change-page="getReviews"></pagination>

  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["course"],
  mixins: [],
  name: "AdminReviews",
  components: {},
  mounted() {
    this.getReviews();
  },
  data() {
    return {
      fields: [
        {
          key: "user.last_name",
          sortable: true,
          label: "Prezime",
          tdClass: 'align-middle'
        },
        {
          key: "user.name",
          sortable: true,
          label: "Ime",
          tdClass: 'align-middle'
        },
        {
          key: "user.email",
          label: "E-mail",
          sortable: true,
          tdClass: 'align-middle'
        },
        {
          key: "user_course_started_review_mark",
          label: "Ocena",
          sortable: false,
          tdClass: 'align-middle'
        },
        {
          key: "user_course_started_review_text",
          label: "Tekst",
          sortable: false,
          tdClass: 'align-middle'
        },
        {
          key: "delete",
          sortable: false,
          label: "Ukloni",
        }
      ],
      reviews: {},
      review_id: '',
    };
  },
  methods: {
    deleteReview(review) {

      this.$swal({
        title: "Da li ste sigurni da želite da obrišete recenziju?",
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
            
            axios.delete("/reviews/admin/" + review.user_course_started_id + "/delete").then(() => {
                creating.close();
                this.getReviews();
                this.$swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: "Recenzija obrisan!",
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
    getReviews(page = 1) {
      axios.get("/reviews/admin/course/" + this.course.course_id + "/all" + "?page=" + page).then((response) => {    
        this.reviews = response.data;
      });
    },
  },
  filters: {
    shorten: function (value) {
      if(value.length > 30) {
        return value.substring(0, 60) + "...";
      }
      return value
    }
  }
};
</script>

<style scoped>
</style>