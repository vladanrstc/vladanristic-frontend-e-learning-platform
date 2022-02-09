<template>
    <div>
        <b-container class="py-5 mb-5">
            <h1 v-if="this.courses.length > 0" class="mb-5 mt-4">{{ $t("courses.started") }}</h1>
            <b-row>
                <!-- v-for="lesson in lessons" -->
                <b-col v-for="course in this.courses" :key="course.course_id" cols="12" sm="6" md="4" lg="3" class="p-3">
                    <!--  -->
                    <b-card style="height: 150px" @click="goTo(course.course_slug)"
                            :title="course.course_name[lang]"
                            :img-src="'/storage/' + course.course_image"
                            img-alt="Card Image"
                            text-variant="dark"
                            img-top
                    >
                    </b-card>
                </b-col>

            </b-row>
            <h1 class="mb-5 mt-4">{{ $t("courses.title") }}</h1>
            <b-row>
                <!-- v-for="lesson in lessons" -->
                <b-col v-for="course in this.courses_not_started" :key="course.course_id" cols="12" sm="6" md="4" lg="3" class="p-3">
                    <!--  -->
                    <b-card style="height: 150px" @click="startCourse(course)"
                            :title="course.course_name[lang]"
                            :img-src="'/storage/' + course.course_image"
                            img-alt="Card Image"
                            text-variant="dark"
                            img-top
                    >
                    </b-card>
                </b-col>

            </b-row>
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
            startCourse(course) {
                if(this.is_logged_param == false) {
                    this.$swal.fire({
                        toast: false,
                        position: "center",
                        icon: "info",
                        title: this.$t("notifications.login_notification"),
                        showConfirmButton: true
                    });
                    return
                }
                this.$swal({
                    title: this.$t('questions.start_course'),
                    icon: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    cancelButtonText: this.$t('answers.no'),
                    confirmButtonText: this.$t('answers.yes'),
                }).then((result) => {

                    if (result.value) {

                        let creating = this.$swal.fire({
                            toast: true,
                            position: "top-end",
                            title: this.$t('notifications.wait'),
                            onBeforeOpen: () => {
                                this.$swal.showLoading();
                            },
                        });

                        axios.post("/user_courses_started", course).then(() => {
                            creating.close();
                            this.getNotStartedCourses();
                            this.getStartedCourses();
                            this.goTo(course.course_slug);
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

                    }

                });
            },
            goTo(slug) {
                this.$router.push('/lessons/' + slug);
            },
            getStartedCourses() {
                axios.get("/courses/started")
                    .then(response => {
                        this.courses = response.data
                    })
                    .catch(e => {
                        this.errors.push(e)
                    });
            },
            getNotStartedCourses() {
                axios.get("/courses/not-started")
                    .then(response => {
                        this.courses_not_started = response.data
                    })
                    .catch(e => {
                        this.errors.push(e)
                    });
            },
            getAllCourses() {
                axios.get("/courses/all")
                    .then(response => {
                        this.courses_not_started = response.data
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

</style>
