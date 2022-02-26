<template>
    <div>

        <b-container class="py-5">
            <div class="row">

                <div class="col col-12 col-md-6">
                    <img class="img-fluid" :src="'/storage/' + this.course.courseImage">
                </div>
                
                <div class="col col-12 col-md-6 text-left d-flex align-items-start w-100">
                    <div class="w-100">
                        <h2 class="mb-0" v-if="this.course != ''">
                            <template v-if="this.course.courseName">
                                {{ this.course.courseName }}
                            </template>
                            <template v-else>
                                {{ $t('notifications.no_translation') }}
                            </template>
                        </h2>
                        
                        <div class="rating">
                            <b-form-rating readonly precision="2" variant="warning" id="rating-inline" inline :value="course.courseAverageMark" show-value></b-form-rating>
                        </div>

                        <p class="mb-0" v-if="this.course != ''">
                            <template v-if="this.course.courseDescription">
                                {{ this.course.courseDescription }}
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

                    <b-progress :max="course.lessonsCount">
                    <b-progress-bar :label="`${((course.lessonsCompletedCount / course.lessonsCount) * 100).toFixed(2)}%`"
                                    :value="course.lessonsCompletedCount"
                                    :max="course.lessonsCount"
                                    variant="success"></b-progress-bar>
                </b-progress>
            </div>
            <b-tabs class="pt-5" active-nav-item-class="font-weight-bold text-blue">
                <b-tab :title="$t('lessons.tab_1_lessons')" active>
                    <div class="container-fluid py-4">
                        <div role="tablist">
                            <b-card v-for="(sec, index) in this.course.sectionList" :key="sec.sectionId" no-body
                                    class="mt-0">
                                <div v-b-toggle="'accordion-' + index"
                                     class="d-flex justify-content-space-between section-accordion">
                                <span>
                                    <template v-if="sec.sectionName">
                                        {{ sec.sectionName }}
                                    </template>
                                    <template v-else>
                                        {{ $t('notifications.no_translation') }}
                                    </template>
                                </span>
                                    <i class="fa fa-chevron-down" aria-hidden="true"></i>
                                </div>
                                <b-collapse :id="'accordion-' + index" accordion="my-accordion" role="tabpanel">
                                    <b-list-group class="border border-0 px-3">
                                        <b-list-group-item class="py-0 item-lesson" button v-for="lesson in sec.lessonList" :key="lesson.lessonId">
                                            <div class="d-flex align-items-center w-100 h-100" @click="getVideoData(lesson)">
                                                <i class="fa fa-play-circle-o mr-2 checkmark-video-size"
                                                   aria-hidden="true"></i>
                                                <span>
                                                <template v-if="lesson.lessonTitle">
                                                    {{ lesson.lessonTitle }}
                                                </template>
                                                <template v-else>
                                                    {{ $t('notifications.no_translation') }}
                                                </template>
                                                </span>
                                            </div>
                                            <div class="d-flex align-items-center">
                                                <!--  && lesson.lessonTestId.meetsRequirements == true -->
                                                <div v-if="lesson.lessonTestId != null && lesson.lessonTestId != undefined" @click="takeTest(lesson.lessonTestId)">
                                                    <i class="fa fa-list-ol mr-3" v-b-tooltip.hover :title="$t('lessons.take_test')" aria-hidden="true"></i>
                                                </div>
                                                <template v-if="lesson.lessonCompleted == true">
                                                    <i class="fa fa-check-circle checkmark-video-size mark-completed"
                                                       v-b-tooltip.hover :title="$t('lessons.lesson_finished')"
                                                       aria-hidden="true"></i>
                                                </template>
                                                <template v-else>
                                                    <i @click="finishLesson(lesson)"
                                                       class="fa fa-check-circle checkmark-video-size mark-complete"
                                                       v-b-tooltip.hover :title="$t('lessons.mark_as_complete')"
                                                       aria-hidden="true"></i>
                                                </template>

                                            </div>
                                        </b-list-group-item>
                                    </b-list-group>
                                </b-collapse>
                            </b-card>
                        </div>
                    </div>
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
                    <div class="py-4">
                        <div class="row no-gutters">
                            <div class="col col-12 d-flex pl-5 ml-md-5">
                                <b-button @click="showReviewModal()" variant="success" class="mr-lg-2 mr-xl-5 mb-4">
                                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                    {{ $t('lessons.add_review') }}
                                </b-button>
                            </div>
                            <div v-for="review in reviews" class="col col-12 col-md-6 d-flex align-items-center justify-content-center mb-2">
                                <div class="p-3">
                                    <i class="fa fa-graduation-cap" aria-hidden="true"></i>
                                </div>
                                <div class="review text-left">

                                    <h4 class="mb-0">{{ review.user.name }} {{ review.user.lastName }}</h4>
                                    <div class="rating-user">
                                        <b-form-rating inline variant="warning" readonly :value="review.userCourseStartedReviewMark"></b-form-rating>
                                    </div>
                                    <div v-html="review.userCourseStartedNote"></div>
                                </div>
                            </div>
                            <div class="col col-12 pl-5 ml-md-5">
                                
                            </div>
                        </div>
                    </div>
                </b-tab>
            </b-tabs>
        </b-container>

        <b-container>

            <b-modal @hide="goBack()" size="lg" centered ref="video_modal" id="video_modal" hide-footer>
                <template v-if="this.video != ''" v-slot:modal-title>
                    {{ video.videoTitle }}
                </template>
                <div v-if="this.video != ''" class="d-block">
                    <p>{{ video.videoDescription }}</p>
                    <b-embed
                        type="iframe"
                        aspect="16by9"
                        :src="video.videoYtLink"
                        allowfullscreen
                    ></b-embed>
                    <p class="text-center mt-3">
                        <a @click="incrementCodeView(video.id)"
                           v-if="video.videoCode != null && video.videoCode != ''" :href="video.videoCode"
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
                        <a @click="uradi(video.videoSlug)"
                           v-if="video.videoPractice != null && video.videoPractice != ''"
                           :href="'/api/video/' + video.videoSlug + '/practice'">
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

            <b-modal size="lg" @hide="getAllData()" centered ref="review_modal" id="review_modal" hide-footer>
                <template v-slot:modal-title>
                    {{ $t('lessons.add_review') }}
                </template>
                <div class="rating">
                    <b-form-rating v-model="reviewMark" variant="warning" class="mb-2"></b-form-rating>
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

            <b-modal size="md" @hide="getAllData()" centered ref="lesson_modal" id="lesson_modal" hide-footer>
                <template v-slot:modal-title>
                    Video
                </template>
                <b-embed
                    type="iframe"
                    aspect="16by9"
                    :src="'https://www.youtube.com/embed/' + currentLesson.lessonVideoLink"
                    allowfullscreen
                ></b-embed>
                <div class="py-3">
                    <a target="_blank" :href="'/storage/'+currentLesson.lessonPractice">
                        <h6 class="m-0"><i class="fa fa-file-pdf-o" aria-hidden="true"></i> {{ $t('lessons.pdf') }}</h6>
                    </a>
                </div>
                <div class="py-1" v-if="currentLesson.lessonCode != null">
                    <a target="_blank" :href="currentLesson.lessonCode">
                        <h6 class="m-0"><i class="fa fa-github" aria-hidden="true"></i> GitHub</h6>
                    </a>
                </div>
                <button v-if="currentLesson.lessonCompleted == false" @click="finishLesson(currentLesson)" class="btn btn-success my-3">
                    <i class="fa fa-check" aria-hidden="true"></i>
                    {{ $t('lessons.finish_lesson') }}
                </button>
            </b-modal>

            <b-modal size="md" title="Test" centered ref="test_modal" id="test_modal" hide-footer>
                <test v-on:closeTestDialog="closeTestDialog()" :lesson="this.lessonTest"></test>
            </b-modal>

        </b-container>
    </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios'
import test from '../components/Test.vue'

export default {
    components: {
       test
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
                videoTitle: "Title",
                videoDescription: "Description",
                videoYtLink: "https://www.youtube.com/embed/WmG3f1lHAPs"
            },
            loadingFlag: false,
            lessonName: '',
            text: ``,
            reviewMark: 0,
            editor: ClassicEditor,
            editorData: '',
            editorConfig: {
                // The configuration of the editor.
            },
            reviews: {},
            // course.course_percentage_completed.lessons_count
            course: {
                "coursePercentageCompleted": {
                    "lessonsCount": 0
                },
                "courseName": "",
                "courseDescription": ""
            },
            currentLesson: {
                "lessonVideoLink": "",
                "lessonPractice": "",
                "currentLesson": ""
            },
            lessonTest: null
        }
    },
    methods: {
        closeTestDialog() {
            this.$refs['test_modal'].hide();
        },
        takeTest(lesson) {
            this.lessonTest = lesson;
            console.log(this.lessonTest)
            this.$refs['test_modal'].show();
        },
        finishLesson(lesson) {
            console.log(lesson)
            axios.get("/lesson/finish/" + lesson.lessonId)
                .then(response => {
                    this.$swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: this.$t("lessons.lesson_finished"),
                        showConfirmButton: false,
                        timer: 4500,
                    });
                    this.$refs['lesson_modal'].hide();
                    this.getLessonsData();
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
        getAllData() {
            this.getLessonsData();
        },
        getLessonsData() {
            axios.get("/course/details/" + this.$route.params.course)
                .then(response => {
                    this.course = response.data
                    this.reviews = response.data.reviews;
                    this.editorData = response.data.userNote
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
        getReviews(page = 1) {

            axios.get("/reviews/course/user/" + this.$route.params.course + "?page=" + page)
                .then(response => {
                    this.reviews = response.data
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
            let currentCourse = this.$route.params.course;
            let creating = this.$swal.fire({
                toast: true,
                position: "top-end",
                title: this.$t('notifications.wait'),
                onBeforeOpen: () => {
                    this.$swal.showLoading();
                },
            });
            axios.patch("/course/started/notes", {
                "notes": this.editorData,
                "course": currentCourse
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
        saveReview() {

            if (this.reviewMark == 0 || this.reviewMark == null) {
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

            let currentCourse = this.$route.params.course;
            let creating = this.$swal.fire({
                toast: true,
                position: "top-end",
                title: this.$t('notifications.wait'),
                onBeforeOpen: () => {
                    this.$swal.showLoading();
                },
            });

            axios.patch("/course/started/review", {
                "rating": this.reviewMark,
                "review": this.text,
                "course": currentCourse
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
        setRate(rate) {
            this.reviewMark = rate;
        },
        getVideoData(lesson) {
            this.currentLesson = lesson;
            this.$refs['lesson_modal'].show()
        },
        showModal() {
            this.$refs['video_modal'].show()
        },
        showReviewModal() {
            this.$refs['review_modal'].show()
        },
        goBack() {
            //this.$router.push("/lessons/databases");
        },
        getVideos() {

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

.ck-editor__editable {
    min-height: 200px;
}

.checkmark-video-size {
    font-size: 25px;
}

.mark-complete:hover {
    color: green;
}

.mark-completed {
    color: green;
}

.list-group-item {
    display: flex !important;
    justify-content: space-between;
}

.list-group-item {
    border: 0px !important;
    border-bottom: 1px solid #0000001f !important;
}

.section-accordion {
    background-color: transparent;
    align-items: center;
    padding-left: 1rem;
    padding-right: 1rem;
    width: 100%;
    min-height: 50px;
}

.section-accordion:focus {
    outline: none;
}

.section-accordion > * {
    margin: 0px;
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

.justify-content-space-between {
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

.item-lesson {
    height: 60px;
    display: flex;
    align-items: center;
}

</style>

