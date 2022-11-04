<template>
    <div>
        <b-container class="py-5 mb-5">
            <div class="px-2" v-if="is_logged_param">
                <h1 v-if="this.courses.length > 0" class="mb-2 mt-4">{{ $t("courses.started-title") }}</h1>
                <p class="px-md-5">
                    {{ $t("courses.started-text") }}
                </p>
                <b-row>
                    <!-- v-for="lesson in lessons" -->
                    <b-col v-for="course in this.courses" :key="course.course_id" cols="12" sm="6" md="4" lg="3" class="p-3">
                        <b-card @click="goTo(course.course_slug)"
                                :title="course.course_name[lang]"
                                :img-src="$hostname + '/storage/' + course.course_image"
                                img-alt="Course Image"
                                text-variant="dark"
                                img-top
                                :class="'course-img'"
                        >
                        </b-card>
                    </b-col>
                </b-row>
            </div>
            <hr v-if="is_logged_param">
            <div class="px-2">
                <h1 class="mb-2 mt-4">{{ $t("courses.not-started-title") }}</h1>
                <p class="px-md-5">
                    {{ $t("courses.not-started-text") }}
                </p>
                <b-row>
                    <!-- v-for="lesson in lessons" -->
                    <b-col v-for="course in this.courses_not_started" :key="course.course_id" cols="12" sm="6" md="4" lg="3" class="p-3">
                        <b-card @click="goTo(course.course_slug, true, course)"
                                :title="course.course_name[lang]"
                                :img-src="$hostname + '/storage/' + course.course_image"
                                img-alt="Course Image"
                                text-variant="dark"
                                img-top
                                :class="'course-img'"
                        >
                        </b-card>
                    </b-col>
                </b-row>
            </div>
        </b-container>
    </div>
</template>

<script>

    import axios from 'axios';
    export default {

        data() {
            return {
                courses: [],
                courses_not_started: [],
                lang: "sr",
                is_logged_param: false
            }
        },
        created() {
            this.is_logged();
            this.lang = this.$root.$i18n.locale

            if(this.is_logged_param == true) {
                this.getStartedCourses();
                this.getNotStartedCourses();
            } else {
                this.getAllCourses();
            }

        },
        methods: {
            is_logged() {
                try {
                    let a = JSON.parse(atob(localStorage.getItem("ac_t").split('.')[1]));
                    this.is_logged_param = true;
                } catch (e) {
                    this.is_logged_param = false;
                }
            },
            goTo(slug, enroll = false, course = null) {
                if(enroll && this.is_logged_param) {
                    axios.post("/coursestart/enroll", course).then(() => {
                        this.$router.push('/lessons/' + slug);
                    }).catch(() => {
                        this.$swal.fire({
                            toast: true,
                            position: "top-end",
                            icon: "error",
                            title: this.$t("notifications.general_error"),
                            showConfirmButton: false,
                            timer: 4500,
                        });
                    });
                } else {
                    this.$router.push('/lessons/' + slug);
                }
            },
            getStartedCourses() {
                axios.get("/coursestart/started")
                    .then(response => {
                        this.courses = response.data.data
                    })
                    .catch(e => {
                        this.errors.push(e)
                    });
            },
            getNotStartedCourses() {
                axios.get("/coursestart/not-started")
                    .then(response => {
                        this.courses_not_started = response.data.data
                    })
                    .catch(e => {
                        this.errors.push(e)
                    });
            },
            getAllCourses() {
                axios.get("/course/all")
                    .then(response => {
                        this.courses_not_started = response.data.data
                    })
                    .catch(e => {
                        this.errors.push(e)
                    });
            }
        }

    }
</script>

<style scoped>

    .card-img-top {
        height: 100%;
    }

    .card {
        min-height:100px;
        justify-content: center;
        border: unset !important;
        z-index: 1;
    }

    .card:hover {
        cursor:pointer;
        transform: scale(1.05);
    }

    .card-img {
        max-height: 100%;
        max-width: 100%;
    }

    .card-title {
        position: absolute;
        bottom: 0;
    }

    .card-title {
        color: #fff;
    }

    .card-body {
        height: 100%;
        position: absolute;
        width: 100%;
        z-index: 9999;
        background-color: #0000007a;
    }

    .swal2-container {
        z-index: 20 !important;
    }

    .course-img > img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        padding: 10px;
        height: 150px;
    }

</style>
