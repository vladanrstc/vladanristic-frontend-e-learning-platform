<template>
    <div class="py-4">
        <div class="row no-gutters">
            <div class="col col-12 d-flex pl-5 ml-md-5" v-if="login_status">
                <b-button @click="showReviewModal()" variant="success" class="mr-lg-2 mr-xl-5 mb-4">
                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                    {{ $t('lessons.add_review') }}
                </b-button>
            </div>
            <div v-for="review in this.reviews" v-bind:key="review.user_course_started_id"
                 class="col col-12 col-md-6 d-flex align-items-center justify-content-center mb-2">
                <div class="p-3">
                    <i class="fa fa-graduation-cap" aria-hidden="true"></i>
                </div>
                <div class="review text-left">
                    <h4 class="mb-0">{{ review.user.name }} {{ review.user.last_name }}</h4>
                    <div class="rating-user">
                        <b-form-rating inline variant="warning" readonly :value="review.user_course_started_review_mark"></b-form-rating>
                    </div>
                    <div v-html="review.user_course_started_review_text"></div>
                </div>
            </div>
        </div>
        <b-modal id="review_modal" size="lg" @hide="getAllData()" centered ref="review_modal" hide-footer>
            <template v-slot:modal-title>
                {{ $t('lessons.add_review') }}
            </template>
            <div class="rating">
                <b-form-rating class="mb-2" v-model="review_mark" variant="warning"></b-form-rating>
            </div>
            <b-form-textarea
                id="textarea"
                v-model="text"
                :placeholder="$t('lessons.enter_text')"
                rows="3"
                max-rows="6"
            ></b-form-textarea>
            <b-button @click="saveReview()" variant="success" class="mr-lg-2 mr-xl-5 mt-3">
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
                {{ $t('lessons.save_review') }}
            </b-button>
        </b-modal>  
    </div>
</template>

<script>
import axios from 'axios'

export default {
    props: ['login_status'],
    mounted() {
        this.getAllData();
    },
    data() {
        return {
            "show": false,
            text: ``,
            review_mark: 0,
            reviews: {},
        }
    },
    methods: {
        getAllData() {
            if(this.login_status) {
                this.getReview();
            }
            this.getReviews();
        },
        getReviews() {

            axios.get("/reviews/course/" + this.$route.params.course)
                .then(response => {
                    this.reviews = response.data.data
                })
                .catch(e => {
                    this.$swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "error",
                        title: this.$t("notifications.general_error"),
                        showConfirmButton: false,
                        timer: 4500,
                    });
                });
        },
        saveReview() {

            if (this.review_mark == 0 || this.review_mark == null) {
                this.$swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "error",
                    title: this.$t("lessons.save_review_error"),
                    showConfirmButton: false,
                    timer: 4500,
                });
                return;
            }

            let current_course = this.$route.params.course;
            let creating = this.$swal.fire({
                toast: true,
                position: "top-end",
                title: this.$t('notifications.wait'),
                onBeforeOpen: () => {
                    this.$swal.showLoading();
                },
            });

            axios.patch("/reviews/courses/started/review", {
                "rating": this.review_mark,
                "review": this.text,
                "course": current_course
            })
                .then(response => {
                    this.$swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: this.$t("notifications.saved_review"),
                        showConfirmButton: false,
                        timer: 4500,
                    });
                })
                .catch(e => {
                    this.$swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "error",
                        title: this.$t("notifications.general_error"),
                        showConfirmButton: false,
                        timer: 4500,
                    });
                });
        },
        getReview() {

            axios.get("/reviews/course/" + this.$route.params.course)
                .then(response => {
                    this.text = response.data.user_course_started_review_text
                    this.review_mark = response.data.user_course_started_review_mark
                })
                .catch(e => {
                    this.$swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "error",
                        title: this.$t("notifications.general_error"),
                        showConfirmButton: false,
                        timer: 4500,
                    });
                });
        },
        setRate(rate) {
            this.review_mark = rate;
        },
        showReviewModal() {
            this.$refs['review_modal'].show()
        }
    }

}
</script>

<style scoped>

.rating-list li {
    float: right;
    color: #ddd;
    padding: 10px 5px;
    padding-top: 0px;
}

.rating-list li:hover,
.rating-list li:hover ~ li {
    color: #ffd700;
    cursor: pointer;
}

.rating-list {
    display: inline-block;
    list-style: none;
}

.review {
    width: 50%;
}

.review > p {
    font-size: 0.8rem;
}

.fa-graduation-cap {
    font-size: 65px;
}

.rating-user > i {
    color: gold;
    margin-right: 5px;
}

.nav-item > a {
    color: #2c3e50;
}

.text-blue {
    color: #3273a8 !important;
}

.rating > i {
    margin-right: 5px;
}

.rating > i:hover {
    color: gold;
    cursor: pointer;
}

.rating-rated {
    color: gold;
}

</style>

