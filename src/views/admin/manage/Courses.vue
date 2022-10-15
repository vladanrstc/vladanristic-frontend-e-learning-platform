<template>
    <div class="container-fluid text-left bg-white p-3">

        <div class="mb-3 w-100 d-flex align-items-center">
            <b-button v-b-modal.modal-prevent-closing variant="outline-success">
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
            <b-table striped hover :items="courses.data" :fields="fields">

                <template v-slot:cell(count)="data" class="row">
                    <div class="d-flex align-items-center justify-content-center" style="vertical-align:middle">
                        {{ (data.index + 1) + (10 * (current_page - 1)) }}
                    </div>
                    
                </template>

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
                    <b-button class="mx-1" @click="manageCourseSections(data.item)" data-toggle="tooltip" data-placement="top" title="Upravljaj sekcijama">
                        <i class="fa fa-list" aria-hidden="true"></i>
                    </b-button>
                    <b-button class="mx-1" @click="manageCourseReviews(data.item)" data-toggle="tooltip" data-placement="top" title="Upravljaj recenzijama">
                        <i class="fa fa-star" aria-hidden="true"></i>
                    </b-button>
                    <b-button class="mx-1" @click="manageCourseNotes(data.item)" data-toggle="tooltip" data-placement="top" title="Upravljaj beleškama">
                        <i class="fa fa-sticky-note-o" aria-hidden="true"></i>
                    </b-button>
                </template>

                <template v-slot:cell(course_name)="data">
                    {{ data.item.course_name[selected_lang] }}
                </template>

                <template v-slot:cell(course_image)="data">
                    <img :src="$hostname + '/storage/' + data.item.course_image" class="course-img">
                </template>

            </b-table>
        </div>
        <pagination :data="courses" @pagination-change-page="getCourses"></pagination>

        <!-- MODAL -->
        <b-modal @hidden="resetModal" hide-footer id="modal-prevent-closing" ref="create_course"
                 :title="this.modal_action">
            <form ref="form" @submit.stop.prevent="addCourse">
                <b-form-group id="example-input-group-1" label="Naziv" label-for="example-input-1">
                    <b-form-input
                        id="example-input-1"
                        name="example-input-1"
                        placeholder="Naziv kursa"
                        v-model="$v.course_form.course_name[selected_lang].$model"
                        :state="validateState('course_name', selected_lang)"
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
                        v-model="$v.course_form.course_description[selected_lang].$model"
                        :state="validateState('course_description', selected_lang)"
                        aria-describedby="input-2-live-feedback"
                    ></b-form-textarea>

                    <b-form-invalid-feedback id="input-2-live-feedback">Morate uneti opis kursa
                    </b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="example-input-group-3" label="Slika kursa" label-for="example-input-3">
                    <b-form-file
                        accept="image/jpeg, image/png, image/gif"
                        v-model="course_image"
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

        <b-modal size="xl" @hidden="resetModal" hide-footer id="modal-prevent-closing-reviews"
                 ref="manage-course-reviews" title="Recenzije">
            <manageReviews :course="this.course_review"></manageReviews>
        </b-modal>

        <b-modal size="xl" @hidden="resetModal" hide-footer id="modal-prevent-closing-notes" ref="manage-course-notes"
                 title="Beleške">
            <manageNotes :course="this.course_review"></manageNotes>
        </b-modal>

    </div>
</template>

<script>
    import axios from "axios";
    import manageReviews from "../../../components/ManageReviews"
    import manageNotes from "../../../components/ManageNotes"
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
                current_page: 0,
                course_image: null,
                course_review: '',
                selected_lang: 'sr',
                options: [
                    {text: 'SR', value: 'sr'},
                    {text: 'EN', value: 'en'}
                ],
                locale: "sr",
                fields: [       
                    {
                        key: "count",
                        sortable: false,
                        label: "#",
                    },                                 
                    {
                        key: "course_name",
                        sortable: true,
                        label: "Naziv kursa",
                        tdClass: 'align-middle'
                    },
                    {
                        key: "course_image",
                        sortable: false,
                        label: "Slika",
                        tdClass: 'align-middle'
                    },
                    {
                        key: "sections",
                        sortable: false,
                        label: "Veze",
                        tdClass: 'align-middle'
                    },
                    {
                        key: "edit",
                        sortable: false,
                        label: "Izmeni",
                        tdClass: 'align-middle'
                    },
                    {
                        key: "delete",
                        sortable: false,
                        label: "Ukloni",
                        tdClass: 'align-middle'
                    }
                ],
                courses: {},
                course_form: {
                    course_description: {
                        "sr": "",
                        "en": "no-data"
                    },
                    course_name: {
                        "sr": "",
                        "en": "no-data"
                    },
                    course_image: null
                },
                course_id: '',
                modal_action: "Dodaj kurs"
            };
        },
        methods: {
            manageCourseReviews(course) {
                this.course_review = course;
                this.$refs["manage-course-reviews"].show();
            },
            manageCourseNotes(course) {
                this.course_review = course;
                this.$refs["manage-course-notes"].show();
            },
            manageCourseSections(course) {
                this.$router.push("/admin/sections/" + course.course_id)
            },
            changeLocale(param) {

                if (param == 1) {

                    if (this.selected_lang == "sr") {

                        this.course_form = {
                            course_description: {
                                "sr": "nema-podataka",
                                "en": ""
                            },
                            course_name: {
                                "sr": "nema-podataka",
                                "en": ""
                            },
                            course_image: null
                        }

                    } else {

                        this.course_form = {
                            course_description: {
                                "sr": "",
                                "en": "no-data"
                            },
                            course_name: {
                                "sr": "",
                                "en": "no-data"
                            },
                            course_image: null
                        }

                    }
                    return;
                }


                if (this.selected_lang == "sr") {

                    this.course_form = {
                        course_description: {
                            "sr": "",
                            "en": "no-data"
                        },
                        course_name: {
                            "sr": "",
                            "en": "no-data"
                        },
                        course_image: null
                    }

                } else {

                    this.course_form = {
                        course_description: {
                            "sr": "nema-podataka",
                            "en": ""
                        },
                        course_name: {
                            "sr": "nema-podataka",
                            "en": ""
                        },
                        course_image: null
                    }

                }


            },
            deleteCourse(course) {

                this.$swal({
                    title: "Da li ste sigurni da želite da obrišete kurs?",
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

                        axios.delete("/course/courses/" + course.course_id).then(() => {
                            creating.close();
                            this.$swal.fire({
                                toast: true,
                                position: "top-end",
                                icon: "success",
                                title: "Kurs obrisan!",
                                showConfirmButton: false,
                                timer: 4500,
                            });
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
                    }

                });

            },
            editCourse(course) {

                this.course_form.course_name[this.selected_lang] = course.course_name[this.selected_lang];
                this.course_form.course_description[this.selected_lang] = course.course_description[this.selected_lang];
                this.course_image = null
                this.course_id = course.course_id;

                this.modal_action = "Izmeni kurs"

                this.$refs["create_course"].show();

            },
            validateState(name, lang) {

                const {$dirty, $error} = this.$v.course_form[name][lang];
                return $dirty ? !$error : null;
            },
            addCourse() {

                if (this.course_id == '') {
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

                    if (this.course_id == '') {
                        let formData = new FormData();

                        formData.append('course_image', this.course_image);
                        formData.append('course_name', this.course_form.course_name[this.selected_lang]);
                        formData.append('course_description', this.course_form.course_description[this.selected_lang]);
                        formData.append('lang', this.selected_lang);

                        axios
                            .post("/course/courses", formData,{
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

                        this.course_form.course_id = this.course_id;
                        let formData = new FormData();

                        formData.append('course_image', this.course_image);
                        formData.append('course_name', this.course_form.course_name[this.selected_lang]);
                        formData.append('course_description', this.course_form.course_description[this.selected_lang]);
                        formData.append('lang', this.selected_lang);

                        axios
                            .post("/course/courses/update/" + this.course_id, formData,
                                {
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                }
                            )
                            .then(res => {
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

                                this.course_id = '';
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
                axios.get("/course/courses?page=" + page).then(response => {
                    this.current_page = page;
                    this.courses = response.data.data;
                });
            },
            resetModal() {
                this.changeLocale();
                this.course_id = '';
                //this.$v.course_form.$reset();
                this.modal_action = "Dodaj kurs"
            }
        },
        validations: {
            course_form: {
                course_name: {
                    sr: {
                        required,
                        minLength: minLength(3),
                    },
                    en: {
                        required,
                        minLength: minLength(3),
                    }
                },
                course_description: {
                    sr: {
                        required,
                        minLength: minLength(3),
                    },
                    en: {
                        required,
                        minLength: minLength(3),
                    }
                }
            },
        },
    };
</script>

<style scoped>
    .course-img {
        width:80px; 
        height:60px; 
        object-fit: contain;
    }

    .btn-info {
        background-color: #4c78dd!important;
    }

    .b-table {
        text-align: center;
    }

    .b-table >tbody > tr > td {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        height: 80px !important;
    }
</style>
