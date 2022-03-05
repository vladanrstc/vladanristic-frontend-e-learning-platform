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
                    <!--<th scope="col">Test</th>-->
                    <th scope="col">Prikaži lekciju</th>
                    <th scope="col">Naslov lekcije</th>
                </tr>
                </thead>
                <draggable v-model="lessons" @end="saveOrder()" tag="tbody">
                    <tr v-for="(lesson, index) in lessons" :key="lesson.lessonId">
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

                        <!--<td scope="row">
                            <b-button variant="info" @click="manageLessonTests(lesson)">
                                <i class="fa fa-question-circle-o" aria-hidden="true"></i>
                            </b-button>
                        </td>
                        -->

                        <td scope="row">
                            <b-form-checkbox v-model="lessons[index].lessonPublished" @change="switchLesson(lesson)" switch></b-form-checkbox>
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
            <manageTest :lang="this.selected_lang" :lesson="this.selectedLesson"></manageTest>
        </b-modal>

        <!-- MODAL -->
        <b-modal
            @hidden="resetModal"
            hide-footer
            id="modal-prevent-closing"
            ref="create_lesson"
            :title="this.modalAction"
        >
            <form ref="form" @submit.stop.prevent="addLesson">
                <b-form-group id="example-input-group-1" label="Naziv" label-for="example-input-1">
                    <b-form-input
                        id="example-input-1"
                        name="example-input-1"
                        placeholder="Naslov lekcije"
                        v-model="$v.lessonForm.lessonTitle.$model"
                        :state="validateState('lessonTitle')"
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
                        v-model="$v.lessonForm.lessonDescription.$model"
                        :state="validateState('lessonDescription')"
                        aria-describedby="input-2-live-feedback"
                    ></b-form-textarea>

                    <b-form-invalid-feedback id="input-2-live-feedback">Morate uneti opis lekcije
                    </b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="example-input-group-3" label="Dodatna literatura" label-for="example-input-3">
                    <b-form-file
                        accept="application/pdf"
                        v-model="lessonPractice"
                        placeholder="Dodajte PDF"
                        drop-placeholder="Dodajte PDF"
                    ></b-form-file>

                    <small v-if="this.lessonPracticeCurrent != null
                    && this.lessonPracticeCurrent != undefined
                    && this.lessonPracticeCurrent != ''"><a target="_blank" :href="this.lessonPracticeCurrent">Trenutni PDF</a></small>
                    <b-form-invalid-feedback id="input-3-live-feedback">Morate odabrati sliku kursa
                    </b-form-invalid-feedback>

                </b-form-group>

                <b-form-group id="example-input-group-6" label="Link do koda" label-for="example-input-6">
                    <b-form-input
                        id="example-input-6"
                        name="example-input-6"
                        placeholder="Link do koda"
                        v-model="lessonForm.lessonCode"
                        aria-describedby="input-6-live-feedback"
                    ></b-form-input>

                </b-form-group>

                <button type="submit" class="btn btn-primary login-btn w-100">
                    <i
                        class="fa fa-plus-circle"
                        v-if="this.modalAction == 'Dodaj lekciju'"
                        aria-hidden="true"
                    ></i>
                    <i class="fa fa-pencil" v-if="this.modalAction == 'Izmeni lekciju'" aria-hidden="true"></i>
                    {{ this.modalAction }}
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
                        v-model="videoLink"
                        aria-describedby="input-11-live-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="input-11-live-feedback">Morate uneti opis videa
                    </b-form-invalid-feedback>
                </b-form-group>

                <b-embed v-if="videoLink != ''"
                        type="iframe"
                        aspect="16by9"
                        v-bind:src="videoLinkReal"
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
            this.courseId = this.$route.params.course;
            this.sectionId = this.$route.params.section;
            this.getLessons();
        },
        data() {
            return {
                lessonPracticeCurrent: "",
                lessonPractice: null,
                selectedLesson: {},
                lessonManaged: "",
                videoLinkReal: "",
                videoLink: "",
                file: null,
                lessons_switch: [],
                flag_false: false,
                flag_true: true,
                courseId: "",
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
                        key: "lessonTitle",
                        sortable: true,
                        label: "Naslov lekcije",
                    },
                ],
                lessons: [],
                lessonForm: {
                    lessonTitle: "",
                    lessonDescription: "",
                    lessonPractice: "",
                    lessonCode: '',
                },
                lessonId: "",
                modalAction: "Dodaj lekciju",
            };
        },
        methods: {
            adaptLink() {

                try {
                    let endValue = "https://www.youtube.com/embed/" + this.videoLink.split(".be/")[1];
                    this.videoLinkReal = endValue;
                } catch (err) {
                    this.videoLinkReal = "";
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
                console.log(this.videoLink.split(".be/")[1])
                axios
                    .patch("/lessons/video", {
                        "lessonVideoLink": this.videoLink.split(".be/")[1],
                        "lessonId": this.lessonManaged.lessonId
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

                axios.patch("/lessons/switch", lesson)
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
                this.selectedLesson = lesson
                this.$refs["manage_tests"].show();
            },
            manageLessonVideo(lesson) {
                this.lessonManaged = lesson;
                if (lesson.lessonVideoLink != null) {
                    if (lesson.lessonVideoLink != null) {
                        this.videoLink = "https://youtu.be/" + lesson.lessonVideoLink
                        this.videoLinkReal = "https://youtu.be/" + lesson.lessonVideoLink
                        this.adaptLink();
                    }
                }

                this.$refs["manage_video"].show();
            },
            backToCourseSections() {
                this.$router.push("/admin/sections/" + this.courseId)
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

                console.log(this.lessons)

                axios.post("/lessons/order", {
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

                        axios.delete("/lessons/" + lesson.lessonId)
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
                this.lessonForm.lessonTitle = lesson.lessonTitle;
                this.lessonForm.lessonDescription = lesson.lessonDescription;
                this.lessonPractice = null
                this.lessonForm.lessonCode = lesson.lessonCode;
                this.lessonPracticeCurrent = '';
                if(lesson.lessonPractice != null && lesson.lessonPractice != undefined) {
                    this.lessonPracticeCurrent = lesson.lessonPractice;
                }

                this.lessonId = lesson.lessonId;
                this.modalAction = "Izmeni lekciju";
                this.$refs["create_lesson"].show();
            },
            validateState(name) {
                const {$dirty, $error} = this.$v.lessonForm[name];
                return $dirty ? !$error : null;
            },
            addLesson() {
                if (this.lessonId == "") {
                    this.$v.lessonForm.$touch();
                }

                if (!this.$v.lessonForm.$anyError) {
                    let creating = this.$swal.fire({
                        toast: true,
                        position: "top-end",
                        title: "Molimo sačekajte..",
                        onBeforeOpen: () => {
                            this.$swal.showLoading();
                        },
                    });

                    this.lessonForm.lessonSectionId = this.sectionId;

                    let formData = new FormData();

                    formData.append('lessonTitle', this.lessonForm.lessonTitle);
                    formData.append('lessonDescription', this.lessonForm.lessonDescription);
                    formData.append('lessonPractice', this.lessonPractice);
                    formData.append('lessonCode', this.lessonForm.lessonCode);
                    formData.append('lessonSectionId', this.sectionId);

                    if (this.lessonId == "") {
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
                        this.lessonForm.lessonId = this.lessonId;

                        let formData = new FormData();

                        formData.append('lessonTitle', this.lessonForm.lessonTitle);
                        formData.append('lessonDescription', this.lessonForm.lessonDescription);
                        formData.append('lessonPractice', this.lessonPractice);
                        formData.append('lessonCode', this.lessonForm.lessonCode);
                        formData.append('lessonSection_id', this.sectionId);
                        formData.append('lessonId', this.lessonForm.lessonId);

                        axios
                            .post("/lessons/update/" + this.lessonId, formData)
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
                axios.get("/lessons/section/" + this.sectionId).then((response) => {
                    console.log(response);
                    //= response.data;
                    this.lessons = []
                    response.data.forEach(el => {
                        if (el.lessonPublished == 1) {
                            el.lessonPublished = true;
                        } else {
                            el.lessonPublished = false;
                        }
                        this.lessons.push(el);
                    });

                });
            },
            resetModal() {
                this.lessonId = "";
                this.videoLinkReal = ""
                this.videoLink = ""
                this.modalAction = "Dodaj lekciju";
            },
        },
        validations: {
            lessonForm: {
                lessonTitle: "",
                lessonDescription: "",
            },
        },
    };
</script>

<style scoped>
    .embed-responsive {
        margin-bottom: 1rem;
    }
</style>
