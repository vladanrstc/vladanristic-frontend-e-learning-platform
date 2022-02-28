<template>
    <div class="container-fluid text-left">
        <div class="mb-3 w-100 d-flex align-items-center" style="justify-content: space-between">
            <div class="d-flex align-items-center">
                <b-button variant="danger" class="mr-3" @click="backToCourseSections()">
                    <i class="fa fa-chevron-circle-left" aria-hidden="true"></i>
                    Nazad na sekcije
                </b-button>

                <b-form-radio-group
                    class="ml-3"
                    id="radio-slots"
                    v-model="selected_lang"
                    :options="options"
                    name="radio-options-slots"
                    @change="changeLocale(1)"
                ></b-form-radio-group>
            </div>
            <div>
                <b-button v-b-modal.modal-prevent-closing variant="success">
                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                    Dodaj lekciju
                </b-button>
                <!--<b-button v-b-modal.modal-prevent-closing variant="danger">
                  Dodaj video
                  <i class="fa fa-youtube-square" aria-hidden="true"></i>
                </b-button> -->
            </div>
        </div>

        <div>
            <table class="table table-striped">
                <thead class="thead-dark">
                <tr>
                    <th scope="col">Ukloni</th>
                    <th scope="col">Izmeni</th>
                    <th scope="col">Video</th>
                    <th scope="col">Test</th>
                    <th scope="col">Prikaži lekciju</th>
                    <th scope="col">Naslov lekcije</th>
                </tr>
                </thead>
                <draggable v-model="lessons" @end="saveOrder()" tag="tbody">
                    <tr v-for="(lesson, index) in lessons" :key="lesson.lesson_id">
                        <td>
                            <b-button variant="danger" @click="deleteLesson(lesson)">
                                <i class="fa fa-trash" aria-hidden="true"></i>
                            </b-button>
                        </td>
                        <td scope="row">
                            <b-button variant="info" @click="editLesson(lesson)">
                                <i class="fa fa-pencil" aria-hidden="true"></i>
                            </b-button>
                        </td>

                        <td scope="row">
                            <b-button variant="danger" @click="manageLessonVideo(lesson)">
                                <i class="fa fa-youtube-play" aria-hidden="true"></i>
                            </b-button>
                        </td>

                        <td scope="row">
                            <b-button variant="info" @click="manageLessonTests(lesson)">
                                <i class="fa fa-question-circle-o" aria-hidden="true"></i>
                            </b-button>
                        </td>

                        <td scope="row">
                            <b-form-checkbox v-model="lessons[index].lesson_published" @change="switchLesson(lesson)"
                                             switch></b-form-checkbox>
                        </td>
                        <td>{{ lesson.lessonTitle }}</td>
                    </tr>
                </draggable>
            </table>
        </div>
        <!-- :title="this.selected_lesson.lesson_title[selected_lang]" -->
        <b-modal
            hide-footer
            id="modal-prevent-closing-5"
            ref="manage_tests"
            size="xl"
            title="Testovi"
            @hidden="getLessons"
        >
            <manageTest :lang="this.selected_lang" :lesson="this.selected_lesson"></manageTest>
        </b-modal>

        <!-- MODAL -->
        <b-modal
            @hidden="resetModal"
            hide-footer
            id="modal-prevent-closing"
            ref="create_lesson"
            :title="this.modal_action"
        >
            <form ref="form" @submit.stop.prevent="addLesson">
                <b-form-group id="example-input-group-1" label="Naziv" label-for="example-input-1">
                    <b-form-input
                        id="example-input-1"
                        name="example-input-1"
                        placeholder="Naslov lekcije"
                        v-model="$v.lesson_form.lesson_title[selected_lang].$model"
                        :state="validateState('lesson_title', selected_lang)"
                        aria-describedby="input-1-live-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="input-1-live-feedback">Naziv lekcije je obavezan
                    </b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="example-input-group-2" label="Opis lekcije" label-for="example-input-2">
                    <b-form-textarea
                        id="example-input-2"
                        name="example-input-2"
                        placeholder="Opis lekcije"
                        v-model="$v.lesson_form.lesson_description[selected_lang].$model"
                        :state="validateState('lesson_description', selected_lang)"
                        aria-describedby="input-2-live-feedback"
                    ></b-form-textarea>

                    <b-form-invalid-feedback id="input-2-live-feedback">Morate uneti opis lekcije
                    </b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="example-input-group-3" label="Dodatna literatura" label-for="example-input-3">
                    <b-form-file
                        accept="application/pdf"
                        v-model="lesson_practice"
                        placeholder="Dodajte PDF"
                        drop-placeholder="Dodajte PDF"
                    ></b-form-file>

                    <small v-if="this.lesson_practice_current != null
                    && this.lesson_practice_current != undefined
                    && this.lesson_practice_current != ''"><a target="_blank" :href="'/storage/'+this.lesson_practice_current">Trenutni PDF</a></small>
                    <b-form-invalid-feedback id="input-3-live-feedback">Morate odabrati sliku kursa
                    </b-form-invalid-feedback>

                </b-form-group>

                <b-form-group id="example-input-group-6" label="Link do koda" label-for="example-input-6">
                    <b-form-input
                        id="example-input-6"
                        name="example-input-6"
                        placeholder="Link do koda"
                        v-model="lesson_form.lesson_code"
                        aria-describedby="input-6-live-feedback"
                    ></b-form-input>

                </b-form-group>

                <button type="submit" class="btn btn-primary login-btn w-100">
                    <i
                        class="fa fa-plus-circle"
                        v-if="this.modal_action == 'Dodaj lekciju'"
                        aria-hidden="true"
                    ></i>
                    <i class="fa fa-pencil" v-if="this.modal_action == 'Izmeni lekciju'" aria-hidden="true"></i>
                    {{ this.modal_action }}
                </button>
            </form>
        </b-modal>

        <b-modal
            @hidden="resetModal"
            hide-footer
            id="modal-prevent-closing-2"
            ref="manage_video"
            title="Upravljaj videom"
        >
            <form ref="form-video" @submit.stop.prevent="addVideo">

                <b-form-group id="example-input-group-11" label="Video link" label-for="example-input-11">
                    <b-form-input @input="adaptLink"
                                  id="example-input-11"
                                  name="example-input-11"
                                  placeholder="Link videa"
                                  v-model="video_link"
                                  aria-describedby="input-11-live-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="input-11-live-feedback">Morate uneti opis videa
                    </b-form-invalid-feedback>
                </b-form-group>

                <b-embed v-if="video_link != ''"
                         type="iframe"
                         aspect="16by9"
                         v-bind:src="video_link_real"
                         allowfullscreen
                ></b-embed>

                <button type="submit" class="btn btn-primary login-btn w-100">
                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                    Dodaj video
                </button>

            </form>
        </b-modal>
    </div>
</template>

<script>
    import axios from "axios";
    import {validationMixin} from "vuelidate";
    import {required, minLength} from "vuelidate/lib/validators";
    import draggable from "vuedraggable";
    import manageTest from "../../../components/ManageTest"

    export default {
        mixins: [validationMixin],
        name: "AdminLessons",
        components: {
            draggable, manageTest
        },
        mounted() {
            this.course_id = this.$route.params.course;
            this.section_id = this.$route.params.section;
            console.log(this.section_id)
            this.getLessons();
        },
        data() {
            return {
                lesson_practice_current: "",
                lesson_practice: null,
                selected_lesson: {},
                lesson_managed: "",
                video_link_real: "",
                video_link: "",
                file: null,
                lessons_switch: [],
                flag_false: false,
                flag_true: true,
                course_id: "",
                selected_lang: "sr",
                options: [
                    {text: "SR", value: "sr"},
                    {text: "EN", value: "en"},
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
                        key: "lesson_title",
                        sortable: true,
                        label: "Naslov lekcije",
                    },
                ],
                lessons: [],
                lesson_form: {
                    lesson_title: {
                        sr: "",
                        en: "no-data",
                    },
                    lesson_description: {
                        sr: "",
                        en: "no-data",
                    },
                    lesson_practice: "",
                    lesson_code: '',
                },
                lesson_id: "",
                modal_action: "Dodaj lekciju",
            };
        },
        methods: {
            adaptLink() {

                try {
                    let end_value = "https://www.youtube.com/embed/" + this.video_link.split(".be/")[1];
                    this.video_link_real = end_value;
                } catch (err) {
                    this.video_link_real = "";
                }

            },
            addVideo() {

                let updating = this.$swal.fire({
                    toast: true,
                    position: "top-end",
                    title: "Molimo sačekajte..",
                    onBeforeOpen: () => {
                        this.$swal.showLoading();
                    },
                });

                axios
                    .post("/lessons/video", {
                        "lang": this.selected_lang,
                        "lesson_video_link": this.video_link.split(".be/")[1],
                        "lesson_id": this.lesson_managed.lesson_id
                    })
                    .then(res => {
                        console.log(res)
                        updating.close();

                        this.$swal.fire({
                            toast: true,
                            position: "top-end",
                            icon: "success",
                            title: "Sačuvano",
                            showConfirmButton: false,
                            timer: 4500,
                        });

                        this.$refs["manage_video"].hide();
                        this.lessons = [];
                        this.getLessons();

                    })
                    .catch(err => {
                        console.log(err)
                        this.$swal.fire({
                            toast: true,
                            position: "top-end",
                            icon: "error",
                            title: "Došlo je do greške. Molimo pokušajte ponovo",
                            showConfirmButton: false,
                            timer: 4500,
                        });
                    });

                /*let formData = new FormData();
                formData.append('file', this.file);

                let updating = this.$swal.fire({
                  toast: true,
                  position: "top-end",
                  title: "Molimo sačekajte..",
                  onBeforeOpen: () => {
                    this.$swal.showLoading();
                  },
                });

                axios
                  .post("/lessons/video",formData,{
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  })
                  .then(res => {
                    console.log(res)
                    updating.close();

                    this.$swal.fire({
                      toast: true,
                      position: "top-end",
                      icon: "success",
                      title: "Sačuvano",
                      showConfirmButton: false,
                      timer: 4500,
                    });

                  })
                  .catch(err => {
                    console.log(err)
                    this.$swal.fire({
                      toast: true,
                      position: "top-end",
                      icon: "error",
                      title: "Došlo je do greške. Molimo pokušajte ponovo",
                      showConfirmButton: false,
                      timer: 4500,
                    });
                  });*/

            },
            switchLesson(lesson) {

                let updating = this.$swal.fire({
                    toast: true,
                    position: "top-end",
                    title: "Molimo sačekajte..",
                    onBeforeOpen: () => {
                        this.$swal.showLoading();
                    },
                });

                axios
                    .post("/lessons/switch", lesson)
                    .then(() => {
                        updating.close();

                        this.$swal.fire({
                            toast: true,
                            position: "top-end",
                            icon: "success",
                            title: "Sačuvano",
                            showConfirmButton: false,
                            timer: 4500,
                        });

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

            },
            manageLessonTests(lesson) {
                this.selected_lesson = lesson
                this.$refs["manage_tests"].show();
            },
            manageLessonVideo(lesson) {
                console.log(lesson)
                this.lesson_managed = lesson;
                if (lesson.lesson_video_link != null) {
                    if (lesson.lesson_video_link[this.selected_lang] != null) {
                        this.video_link = "https://youtu.be/" + lesson.lesson_video_link[this.selected_lang]
                        this.video_link_real = "https://youtu.be/" + lesson.lesson_video_link[this.selected_lang]
                        this.adaptLink();
                    }
                }

                this.$refs["manage_video"].show();
            },
            backToCourseSections() {
                this.$router.push("/admin/sections/" + this.course_id)
            },
            saveOrder() {

                let updating = this.$swal.fire({
                    toast: true,
                    position: "top-end",
                    title: "Molimo sačekajte..",
                    onBeforeOpen: () => {
                        this.$swal.showLoading();
                    },
                });

                axios
                    .post("/lessons/order", {
                        lessons: this.lessons
                    })
                    .then(() => {
                        updating.close();

                        this.$swal.fire({
                            toast: true,
                            position: "top-end",
                            icon: "success",
                            title: "Redosled sačuvan",
                            showConfirmButton: false,
                            timer: 4500,
                        });

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

            },
            changeLocale(param) {
                if (param == 1) {
                    if (this.selected_lang == "sr") {
                        this.lesson_form = {
                            lesson_title: {
                                sr: "nema-podataka",
                                en: "",
                            },
                            lesson_description: {
                                sr: "nema-podataka",
                                en: "",
                            },
                            lesson_practice: "",
                            lesson_code: ''
                        };
                    } else {
                        this.lesson_form = {
                            lesson_title: {
                                sr: "",
                                en: "no-data",
                            },
                            lesson_description: {
                                sr: "",
                                en: "no-data",
                            },
                            lesson_practice: "",
                            lesson_code:""
                        };
                    }
                    return;
                }

                if (this.selected_lang == "sr") {
                    this.lesson_form = {
                        lesson_title: {
                            sr: "",
                            en: "no-data",
                        },
                        lesson_description: {
                            sr: "",
                            en: "no-data",
                        },
                        lesson_practice: "",
                        lesson_code: ''
                    };
                } else {
                    this.lesson_form = {
                        lesson_title: {
                            sr: "nema-podataka",
                            en: "",
                        },
                        lesson_description: {
                            sr: "nema-podataka",
                            en: "",
                        },
                        lesson_practice: "",
                        lesson_code: ''
                    };
                }
            },
            deleteLesson(lesson) {
                this.$swal({
                    title: "Da li ste sigurni da želite da obrišete lekciju?",
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

                        axios
                            .delete("/lessons/" + lesson.lesson_id)
                            .then(() => {
                                creating.close();
                                this.getLessons();
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

                        this.$swal("Obrisana lekcija!", "", "success");
                    }
                });
            },
            editLesson(lesson) {
                console.log(lesson)
                this.lesson_form.lesson_title[this.selected_lang] = lesson.lesson_title[this.selected_lang];
                this.lesson_form.lesson_description[this.selected_lang] = lesson.lesson_description[this.selected_lang];
                this.lesson_practice = null
                this.lesson_form.lesson_code = lesson.lesson_code;
                this.lesson_practice_current = '';
                if(lesson.lesson_practice != null && lesson.lesson_practice != undefined) {
                    this.lesson_practice_current = lesson.lesson_practice[this.selected_lang];
                }

                this.lesson_id = lesson.lesson_id;
                this.modal_action = "Izmeni lekciju";
                this.$refs["create_lesson"].show();
            },
            validateState(name, lang) {
                const {$dirty, $error} = this.$v.lesson_form[name][lang];
                return $dirty ? !$error : null;
            },
            addLesson() {
                if (this.lesson_id == "") {
                    this.$v.lesson_form.$touch();
                }

                if (!this.$v.lesson_form.$anyError) {
                    let creating = this.$swal.fire({
                        toast: true,
                        position: "top-end",
                        title: "Molimo sačekajte..",
                        onBeforeOpen: () => {
                            this.$swal.showLoading();
                        },
                    });

                    this.lesson_form.lang = this.selected_lang;
                    this.lesson_form.lesson_section_id = this.section_id;

                    console.log(this.lesson_form)

                    let formData = new FormData();

                    formData.append('lesson_title', this.lesson_form.lesson_title[this.selected_lang]);
                    formData.append('lesson_description', this.lesson_form.lesson_description[this.selected_lang]);
                    formData.append('lesson_practice', this.lesson_practice);
                    formData.append('lesson_code', this.lesson_form.lesson_code);
                    formData.append('lesson_section_id', this.section_id);

                    formData.append('lang', this.selected_lang);

                    if (this.lesson_id == "") {
                        axios
                            .post("/lessons", formData,
                                {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            })
                            .then(() => {
                                creating.close();
                                this.$swal.fire({
                                    toast: true,
                                    timer: 3000,
                                    position: "top-end",
                                    icon: "success",
                                    title: "Uspešno dodata lekcija",
                                    showConfirmButton: false,
                                });
                                this.lessons = [];
                                this.getLessons();

                                this.$refs["create_lesson"].hide();
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
                        this.lesson_form.lesson_id = this.lesson_id;

                        let formData = new FormData();

                        formData.append('lesson_title', this.lesson_form.lesson_title[this.selected_lang]);
                        formData.append('lesson_description', this.lesson_form.lesson_description[this.selected_lang]);
                        formData.append('lesson_practice', this.lesson_practice);
                        formData.append('lesson_code', this.lesson_form.lesson_code);
                        formData.append('lesson_section_id', this.section_id);
                        formData.append('lesson_id', this.lesson_form.lesson_id);

                        formData.append('lang', this.selected_lang);

                        axios
                            .post("/lessons/update/" + this.lesson_id, formData)
                            .then((res) => {
                                console.log(res);
                                creating.close();
                                this.$swal.fire({
                                    toast: true,
                                    timer: 3000,
                                    position: "top-end",
                                    icon: "success",
                                    title: "Uspešno izmenjena lekcija",
                                    showConfirmButton: false,
                                });
                                this.lessons = [];
                                this.getLessons();

                                this.$refs["create_lesson"].hide();

                                this.lesson_id = "";
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
            getLessons() {
                axios.get("/lessons/section/" + this.section_id).then((response) => {
                    console.log(response);
                    //= response.data;
                    this.lessons = []
                    response.data.forEach(el => {
                        if (el.lesson_published == 1) {
                            el.lesson_published = true;
                        } else {
                            el.lesson_published = false;
                        }
                        this.lessons.push(el);
                    });

                });
            },
            resetModal() {
                this.changeLocale();
                this.lesson_id = "";
                this.video_link_real = ""
                this.video_link = ""
                this.modal_action = "Dodaj lekciju";
            },
        },
        validations: {
            lesson_form: {
                lesson_title: {
                    sr: {
                        required,
                        minLength: minLength(3),
                    },
                    en: {
                        required,
                        minLength: minLength(3),
                    },
                },
                lesson_description: {
                    sr: {
                        required,
                        minLength: minLength(3),
                    },
                    en: {
                        required,
                        minLength: minLength(3),
                    },
                },
            },
        },
    };
</script>

<style scoped>
    .embed-responsive {
        margin-bottom: 1rem;
    }
</style>
