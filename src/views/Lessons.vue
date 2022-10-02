<template>
    <div>

        <b-container class="py-5 mt-md-3">
            <div class="row">

                <div class="col col-12 col-md-6 d-flex align-items-center justify-content-center">
                    <img id="course-image" class="img-fluid" :src="'http://vladanristic.site/storage/' + this.course.course_image">
                </div>

                <div class="col col-12 col-md-6 text-left d-flex align-items-start w-100">
                    <div class="w-100">
                        <h2 class="mb-0" v-if="this.course != ''">
                            <template v-if="this.course.course_name[this.$root.$i18n.locale]">
                                {{ this.course.course_name[this.$root.$i18n.locale] }}
                            </template>
                            <template v-else>
                                {{ $t('notifications.no_translation') }}
                            </template>
                        </h2>
                        <div class="rating">
                            <b-form-rating readonly precision="2" variant="warning" id="rating-inline" inline :value="course.course_average_mark" show-value></b-form-rating>
                        </div>
                        <p class="mb-0 text-justify" v-if="this.course != ''">
                            <template v-if="this.course.course_description[this.$root.$i18n.locale]">
                                {{ this.course.course_description[this.$root.$i18n.locale] }}
                            </template>
                            <template v-else>
                                {{ $t('notifications.no_translation') }}
                            </template>
                        </p>
                    </div>
                </div>

            </div>
            <div class="lesson-progress pt-5">
                <div class="progress-labels">
                    <h6 class="text-left text-uppercase font-weight-bold">{{ $t("lessons.progress") }}</h6>
                    <!-- <h6 class="text-left text-uppercase font-weight-bold">33%</h6> -->
                </div>
                <b-progress v-if="course.course_percentage_completed != false" :max="course.course_percentage_completed.lessons_count">
                    <b-progress-bar :label="`${((course.course_percentage_completed.lessons_completed_count / course.course_percentage_completed.lessons_count) * 100).toFixed(2)}%`"
                                    :value="course.course_percentage_completed.lessons_completed_count"
                                    :max="course.course_percentage_completed.lessons_count"
                                    variant="success"></b-progress-bar>
                </b-progress>
            </div>
            <b-tabs class="pt-5" active-nav-item-class="font-weight-bold text-blue">
                <b-tab :title="$t('lessons.tab_1_lessons')" active>
                    <lessonEnrollment :sections="this.course.sections"></lessonEnrollment>
                </b-tab>
                <b-tab :title="$t('lessons.tab_2_notes')">
                    <div class="py-4 px-3">
                        <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
                        <div class="d-flex justify-content-start mt-4">
                            <b-button variant="success" @click="saveNote()">
                                <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                {{ $t('lessons.add_note') }}
                            </b-button>
                        </div>
                    </div>
                </b-tab>
                <b-tab :title="$t('lessons.tab_3_reviews')">
                    <lessonReviews></lessonReviews>                    
                </b-tab>
            </b-tabs>
        </b-container>

        <b-container>

            <b-modal size="lg" centered ref="video_modal" id="video_modal" hide-footer>
                <template v-if="this.video != ''" v-slot:modal-title>
                    {{ video.video_title }}
                </template>
                <div v-if="this.video != ''" class="d-block">
                    <p>{{ video.video_description }}</p>
                    <b-embed
                        type="iframe"
                        aspect="16by9"
                        :src="video.video_yt_link"
                        allowfullscreen
                    ></b-embed>
                    <p class="text-center mt-3">
                        <a @click="incrementCodeView(video.id)"
                           v-if="video.video_code != null && video.video_code != ''" :href="video.video_code"
                           target="_blank">
                            <svg class="bi bi-file-zip" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                      d="M4 1h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V3a2 2 0 012-2zm0 1a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V3a1 1 0 00-1-1H4z"
                                      clip-rule="evenodd"/>
                                <path fill-rule="evenodd"
                                      d="M6.5 8.5a1 1 0 011-1h1a1 1 0 011 1v.938l.4 1.599a1 1 0 01-.416 1.074l-.93.62a1 1 0 01-1.109 0l-.93-.62a1 1 0 01-.415-1.074l.4-1.599V8.5zm2 0h-1v.938a1 1 0 01-.03.243l-.4 1.598.93.62.93-.62-.4-1.598a1 1 0 01-.03-.243V8.5z"
                                      clip-rule="evenodd"/>
                                <path d="M7.5 2H9v1H7.5zm-1 1H8v1H6.5zm1 1H9v1H7.5zm-1 1H8v1H6.5zm1 1H9v1H7.5V6z"/>
                            </svg>
                            Kod iz lekcije
                        </a>
                    </p>
                    <p class="text-center">
                        <a @click="uradi(video.video_slug)"
                           v-if="video.video_practice != null && video.video_practice != ''"
                           :href="'/api/video/' + video.video_slug + '/practice'">
                            <svg class="bi bi-file-earmark-check" width="1em" height="1em" viewBox="0 0 16 16"
                                 fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M9 1H4a2 2 0 00-2 2v10a2 2 0 002 2h5v-1H4a1 1 0 01-1-1V3a1 1 0 011-1h5v2.5A1.5 1.5 0 0010.5 6H13v2h1V6L9 1z"/>
                                <path fill-rule="evenodd"
                                      d="M15.854 10.146a.5.5 0 010 .708l-3 3a.5.5 0 01-.708 0l-1.5-1.5a.5.5 0 01.708-.708l1.146 1.147 2.646-2.647a.5.5 0 01.708 0z"
                                      clip-rule="evenodd"/>
                            </svg>
                            Dodatna vežbanja
                        </a>
                    </p>
                </div>
            </b-modal>           

        </b-container>
    </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios'
import test from '../components/Test.vue'
import lessonEnrollment from "./LessonsSubsections/LessonEnrollment.vue";
import lessonReviews from "./LessonsSubsections/LessonReviews.vue";

export default {
    components: {
       test,
       lessonEnrollment,
       lessonReviews
    },
    mounted() {
        this.getAllData();
    },
    data() {
        return {
            slug: "",
            "show": false,
            videos: [],
            video: {
                video_title: "Title",
                video_description: "Description",
                video_yt_link: "https://www.youtube.com/embed/WmG3f1lHAPs"
            },
            loadingFlag: false,
            lesson_name: '',
            text: ``,
            review_mark: 0,
            editor: ClassicEditor,
            editorData: '',
            editorConfig: {
                // The configuration of the editor.
            },
            reviews: {},
            // course.course_percentage_completed.lessons_count
            course: {
                "course_percentage_completed": {
                    "lessons_counted": 0
                },
                "course_name": "",
                "course_description": ""
            },
            current_lesson: {
                "lesson_video_link": "",
                "lesson_practice": "",
                "current_lesson": ""
            },
            lesson_test: null
        }
    },
    methods: {
        getAllData() {
            this.getLessonsData();
            this.getNotes();
        },
        getLessonsData() {
            axios.get("/course/details/" + this.$route.params.course)
                .then(response => {
                    this.course = response.data.data
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
        saveNote() {
            let current_course = this.$route.params.course;
            let creating = this.$swal.fire({
                toast: true,
                position: "top-end",
                title: this.$t('notifications.wait'),
                onBeforeOpen: () => {
                    this.$swal.showLoading();
                },
            });
            axios.patch("/courses/started/notes", {
                "notes": this.editorData,
                "course": current_course
            })
                .then(response => {
                    this.$swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: this.$t("notifications.saved_note"),
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
        getNotes() {
            axios.get("/notes/course/" + this.$route.params.course)
                .then(response => {

                    if (response.data.data.user_course_started_note != null && response.data.data.user_course_started_note != undefined) {
                        this.editorData = response.data.data.user_course_started_note
                    }

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

.fa-graduation-cap {
    font-size: 65px;
}

.ck-editor__editable {
    min-height: 200px;
}

.tab-pane {
    background-color: #f6f8f8;
    margin-top: 1rem;
    box-shadow: 4px 5px 9px -3px grey;
}

.nav-item > a {
    color: #2c3e50;
}

.text-blue {
    color: #3273a8 !important;
}

.progress-labels {
    display: flex;
    justify-content: space-between;
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

#course-image {
    max-height: 250px;
}

</style>

