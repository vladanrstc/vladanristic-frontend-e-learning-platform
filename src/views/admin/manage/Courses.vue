<template>
    <div class="container-fluid text-left">

        <div class="mb-3 w-100 d-flex align-items-center">
            <b-button v-b-modal.modal-prevent-closing variant="success">
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
                Dodaj kurs
            </b-button>

            <b-form-radio-group
                class="ml-3"
                id="radio-slots"
                v-model="selected_lang"
                :options="options"
                name="radio-options-slots"
                @change="changeLocale(1)"
            >

            </b-form-radio-group>
        </div>

        <div>
            <b-table striped hover :items="courses" :fields="fields">
                
                <template v-slot:cell(edit)="data">
                    <b-button variant="info" @click="editCourse(data.item)">
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                    </b-button>
                </template>

                <template v-slot:cell(delete)="data">
                    <b-button variant="danger" @click="deleteCourse(data.item)">
                        <i class="fa fa-trash" aria-hidden="true"></i>
                    </b-button>
                </template>

                <template v-slot:cell(sections)="data">
                    <b-button @click="manageCourseSections(data.item)">
                        <i class="fa fa-list" aria-hidden="true"></i>
                    </b-button>
                </template>

                <template v-slot:cell(reviews)="data">
                    <b-button @click="manageCourseReviews(data.item)">
                        <i class="fa fa-star" aria-hidden="true"></i>
                    </b-button>
                </template>

                <template v-slot:cell(notes)="data">
                    <b-button @click="manageCourseNotes(data.item)">
                        <i class="fa fa-sticky-note-o" aria-hidden="true"></i>
                    </b-button>
                </template>

                <template v-slot:cell(courseName)="data">
                    {{ data.item.courseName }}
                </template>

                <template v-slot:cell(courseImage)="data">
                    <img :src="'/storage/' + data.item.courseImage" style="width:80px; height:60px">
                </template>

            </b-table>
        </div>
        <!--
        <pagination :data="courses" @pagination-change-page="getCourses"></pagination>
        -->

        <!-- MODAL -->
        <b-modal @hidden="resetModal" hide-footer id="modal-prevent-closing" ref="create_course"
                 :title="this.modal_action">
            <form ref="form" @submit.stop.prevent="addCourse">
                <b-form-group id="example-input-group-1" label="Naziv" label-for="example-input-1">
                    <b-form-input
                        id="example-input-1"
                        name="example-input-1"
                        placeholder="Naziv kursa"
                        v-model="$v.course_form.courseName.$model"
                        :state="validateState('courseName')"
                        aria-describedby="input-1-live-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="input-1-live-feedback">Naziv kursa je obavezan
                    </b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="example-input-group-2" label="Opis" label-for="example-input-2">
                    <b-form-textarea
                        id="example-input-2"
                        name="example-input-2"
                        placeholder="Opis kursa"
                        v-model="$v.course_form.courseDescription.$model"
                        :state="validateState('courseDescription')"
                        aria-describedby="input-2-live-feedback"
                    ></b-form-textarea>

                    <b-form-invalid-feedback id="input-2-live-feedback">Morate uneti opis kursa
                    </b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="example-input-group-3" label="Slika kursa" label-for="example-input-3">
                    <b-form-file
                        accept="image/jpeg, image/png, image/gif"
                        v-model="courseImage"
                        placeholder="Izaberite sliku"
                        drop-placeholder="Izaberite sliku"
                    ></b-form-file>

                    <b-form-invalid-feedback id="input-3-live-feedback">Morate odabrati sliku kursa
                    </b-form-invalid-feedback>
                </b-form-group>

                <button type="submit" class="btn btn-primary login-btn w-100">
                    <i class="fa fa-plus-circle" v-if="this.modal_action == 'Dodaj kurs'" aria-hidden="true"></i>
                    <i class="fa fa-pencil" v-if="this.modal_action == 'Izmeni kurs'" aria-hidden="true"></i>
                    {{ this.modal_action }}
                </button>
            </form>
        </b-modal>

        <b-modal size="xl" @hidden="resetModal" hide-footer id="modal-prevent-closing-reviews" ref="manage-course-reviews" title="Recenzije">
            <manageReviews :course="this.courseReview"></manageReviews>
        </b-modal>

        <b-modal size="xl" @hidden="resetModal" hide-footer id="modal-prevent-closing-notes" ref="manage-course-notes" title="Beleške">
            <manageNotes :course="this.courseReview"></manageNotes>
        </b-modal>

    </div>
</template>

<script>
    import axios from "axios";
    import manageReviews from "../../../components/ManageReviews.vue"
    import manageNotes from "../../../components/ManageNotes.vue"
    import {validationMixin} from "vuelidate";
    import {required, minLength} from "vuelidate/lib/validators";

    export default {
        mixins: [validationMixin],
        name: "AdminCourses",
        components: {
            manageReviews, manageNotes
        },
        mounted() {
            this.getCourses();
        },
        data() {
            return {
                courseImage: null,
                courseReview: '',
                selected_lang: 'sr',
                options: [
                    {text: 'SR', value: 'sr'},
                    {text: 'EN', value: 'en'}
                ],
                locale: "sr",
                fields: [
                    {
                        key: "delete",
                        sortable: false,
                        label: "Ukloni",
                    },
                    {
                        key: "edit",
                        sortable: false,
                        label: "Izmeni",
                    },
                    {
                        key: "sections",
                        sortable: false,
                        label: "Sekcije",
                    },
                    {
                        key: "reviews",
                        sortable: false,
                        label: "Recenzije",
                    },
                    {
                        key: "notes",
                        sortable: false,
                        label: "Beleške",
                    },
                    {
                        key: "courseName",
                        sortable: true,
                        label: "Naziv kursa",
                    },
                    {
                        key: "courseImage",
                        sortable: false,
                        label: "Slika",
                    }
                ],
                courses: [],
                course_form: {
                    course_description: {},
                    course_name: {},
                    course_image: null
                },
                courseId: '',
                modal_action: "Dodaj kurs"
            };
        },
        methods: {
            manageCourseReviews(course) {
                this.courseReview = course;
                this.$refs["manage-course-reviews"].show();
            },
            manageCourseNotes(course) {
                this.courseReview = course;
                this.$refs["manage-course-notes"].show();
            },
            manageCourseSections(course) {
                this.$router.push("/admin/sections/" + course.courseId)
            },
            deleteCourse(course) {

                this.$swal({
                    title: "Da li ste sigurni da želite da obrišete kurs?",
                    icon: "question",
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

                        axios.delete("/courses/" + course.courseId).then(() => {
                            creating.close();
                            this.getCourses();
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

                        this.$swal("Obrisan kurs!", '', "success");

                    }

                });

            },
            editCourse(course) {
                
                this.course_form.courseName = course.courseName;
                this.course_form.courseDescription = course.courseDescription;
                this.courseImage = null
                this.courseId = course.courseId;

                this.modal_action = "Izmeni kurs"

                this.$refs["create_course"].show();

            },
            validateState(name) {
                console.log(name)
                const {$dirty, $error} = this.$v.course_form[name];
                return $dirty ? !$error : null;
            },
            addCourse() {

                if (this.courseId == '') {
                    this.$v.course_form.$touch();
                }

                if (!this.$v.course_form.$anyError) {

                    let creating = this.$swal.fire({
                        toast: true,
                        position: "top-end",
                        title: "Molimo sačekajte..",
                        onBeforeOpen: () => {
                            this.$swal.showLoading();
                        },
                    });

                    this.course_form.lang = this.selected_lang;

                    if (this.courseId == '') {
                        let formData = new FormData();

                        formData.append('course_image', this.courseImage);
                        formData.append('course_name', this.course_form.courseName);
                        formData.append('course_description', this.course_form.courseDescription);
                        formData.append('lang', this.selected_lang);

                        axios
                            .post("/courses", formData,{
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                }
                            )
                            .then(() => {
                                creating.close();
                                this.$swal.fire({
                                    toast: true,
                                    timer: 3000,
                                    position: "top-end",
                                    icon: "success",
                                    title: "Uspešno dodat kurs",
                                    showConfirmButton: false,
                                });

                                this.getCourses();

                                this.$refs["create_course"].hide();
                            })
                            .catch(() => {
                                this.$swal.fire({
                                    toast: true,
                                    position: "top-end",
                                    icon: "error",
                                    title: "Došlo je do greške. Molimo pokušajte ponovo",
                                    showConfirmButton: false,
                                    timer: 4500,
                                });
                            });

                    } else {

                        this.course_form.courseId = this.courseId;
                        let formData = new FormData();

                        formData.append('course_image', this.courseImage);
                        formData.append('course_name', this.course_form.courseName);
                        formData.append('course_description', this.course_form.courseDescription);
                        formData.append('lang', this.selected_lang);

                        axios
                            .post("/courses/update/" + this.courseId, formData,
                                {
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                }
                            )
                            .then(res => {
                                console.log(res)
                                creating.close();
                                this.$swal.fire({
                                    toast: true,
                                    timer: 3000,
                                    position: "top-end",
                                    icon: "success",
                                    title: "Uspešno izmenjen kurs",
                                    showConfirmButton: false,
                                });

                                this.getCourses();

                                this.$refs["create_course"].hide();

                                this.courseId = '';
                            })
                            .catch(() => {
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

                }

            },
            getCourses(page = 1) {
                axios.get("/courses?page=" + page).then(response => {
                    console.log(response)
                    this.courses = response.data;
                });
            },
            resetModal() {
                this.changeLocale();
                this.courseId = '';
                //this.$v.course_form.$reset();
                this.modal_action = "Dodaj kurs"
            }
        },
        validations: {
            course_form: {
                courseName: {},
                courseDescription: {}                    
            },
        },
    };
</script>

<style scoped>
</style>
