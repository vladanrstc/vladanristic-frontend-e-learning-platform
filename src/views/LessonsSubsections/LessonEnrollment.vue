<template>
    <div class="container-fluid py-2">
        <div role="tablist">
            <b-card v-for="(sec, index) in this.sections" :key="sec.section_id" no-body
                    class="my-2">
                <div v-b-toggle="'accordion-' + index" class="d-flex justify-content-space-between section-accordion">
                    <span>
                        <template v-if="sec.section_name[$root.$i18n.locale]">
                            {{ sec.section_name[$root.$i18n.locale] }}
                        </template>
                        <template v-else>
                            {{ $t('notifications.no_translation') }}
                        </template>
                    </span>
                    <i class="fa fa-chevron-down" aria-hidden="true"></i>
                </div>
                <b-collapse :id="'accordion-' + index" accordion="my-accordion" role="tabpanel">
                    <b-list-group class="border border-0 px-3">
                        <b-list-group-item class="py-0 item-lesson" button v-for="lesson in sec.lessons" :key="lesson.lesson_id">
                            <div class="d-flex align-items-center w-100 h-100" @click="getVideoData(lesson)">
                                <i class="fa fa-play-circle-o mr-2 checkmark-video-size"
                                   aria-hidden="true"></i>
                                <span>
                                <template v-if="lesson.lesson_title[$root.$i18n.locale]">
                                    {{ lesson.lesson_title[$root.$i18n.locale] }}
                                </template>
                                <template v-else>
                                    {{ $t('notifications.no_translation') }}
                                </template>
                                </span>
                            </div>
                            <div class="d-flex align-items-center">
                                <div v-if="lesson.test != null && lesson.test != undefined && lesson.test.meets_requirements == true" @click="takeTest(lesson)">
                                    <i class="fa fa-list-ol mr-3" v-b-tooltip.hover :title="$t('lessons.take_test')" aria-hidden="true"></i>
                                </div>
                                <template v-if="lesson.lesson_completed == true">
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
        <b-modal id="lesson_modal" size="md" centered ref="lesson_modal" hide-footer>
                <template v-slot:modal-title>
                    Video
                </template>
                <b-embed
                    type="iframe"
                    aspect="16by9"
                    :src="'https://www.youtube.com/embed/' + current_lesson.lesson_video_link[this.$root.$i18n.locale]"
                    allowfullscreen
                ></b-embed>
                <div v-if="current_lesson.lesson_practice != null" class="py-3">
                    <a target="_blank" :href="$hostname + '/storage/' + current_lesson.lesson_practice[this.$root.$i18n.locale]">
                        <h6 class="m-0"><i class="fa fa-file-pdf-o" aria-hidden="true"></i> {{ $t('lessons.pdf') }}</h6>
                    </a>
                </div>
                <div class="py-1" v-if="current_lesson.lesson_code != null">
                    <a target="_blank" :href="current_lesson.lesson_code">
                        <h6 class="m-0"><i class="fa fa-github" aria-hidden="true"></i> GitHub</h6>
                    </a>
                </div>
                <button v-if="current_lesson.lesson_completed == false" @click="finishLesson(current_lesson)" class="btn btn-success my-3">
                    <i class="fa fa-check" aria-hidden="true"></i>
                    {{ $t('lessons.finish_lesson') }}
                </button>
        </b-modal>

        <b-modal size="md" title="Test" centered ref="test_modal" id="test_modal" hide-footer>
            <test v-on:closeTestDialog="closeTestDialog()" :lesson="this.lesson_test"></test>
        </b-modal>

    </div>
</template>

<script>
import axios from 'axios'
import test from '../../components/Test.vue'

export default {
    components: {
        test
    },
    props: ['sections', 'login_status'],
    mounted() {
        
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
        closeTestDialog() {
            this.$refs['test_modal'].hide();
        },
        takeTest(lesson) {
            if(this.login_status)  {
                this.lesson_test = lesson;
                this.$refs['test_modal'].show();
            }            
        },
        finishLesson(lesson) {
            if(this.login_status)  {
                axios.get("/coursestart/lesson/finish/" + lesson.lesson_id)
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
                    this.$emit('refreshLessonsData')
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
            }            
        },
        getVideoData(lesson) {
            if(this.login_status)  {
                this.current_lesson = lesson;
                this.$refs['lesson_modal'].show()
            }
        
        },
        showModal() {
            this.$refs['video_modal'].show()
        }
    }

}
</script>

<style scoped>


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

.item-lesson {
    height: 60px;
    display: flex;
    align-items: center;
}

</style>

