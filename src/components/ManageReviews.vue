<template>
  <div class="container-fluid text-left">

    <div>
      <b-table striped hover :items="reviews" :fields="fields">

        <template v-slot:cell(delete)="data">
          <b-button variant="danger" @click="deleteReview(data.item)">
            <i class="fa fa-trash" aria-hidden="true"></i>
          </b-button>
        </template>
        
        <template v-slot:cell(userCourseStartedReviewText)="data">
          <div v-b-tooltip.hover.left :title="data.item.userCourseStartedReviewText">
            {{ data.item.userCourseStartedReviewText }}
          </div>
        </template>

      </b-table>
    </div>
    <!--
    <pagination :data="reviews" @pagination-change-page="getReviews"></pagination>
    --->

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
          key: "userCourseStartedReviewMark",
          label: "Ocena",
          sortable: false,
        },
        {
          key: "userCourseStartedReviewText",
          label: "Tekst",
          sortable: false,
        },
      ],
      reviews: {},
      review_id: '',
    };
  },
  methods: {
    deleteReview(review) {

      this.$swal({
        title: "Da li ste sigurni da želite da obrišete recenziju?",
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

            axios.delete("/reviews/" + review.userCourseStartedId).then(() => {
                creating.close();
                this.getReviews();
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

            this.$swal("Obrisana recenzija!", "", "success");

        }

      });

    },
    getReviews(page = 1) {
      console.log(this.course)
      axios.get("/reviews/course/" + this.course.courseId + "?page=" + page).then((response) => {      
        console.log(response)  
        this.reviews = response.data;
      });
    },
    resetModal() {

    }
  },
  filters: {
    shorten: function (value) {
      if(value.length > 30) {
        return value.substring(0, 60) + "...";
      }
    }
  }
};
</script>

<style scoped>
</style>