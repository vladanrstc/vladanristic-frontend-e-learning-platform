<template>
    <div>
        <div class="test-container" v-if="results_in == false">
            <div v-for="(question_spec, index) in this.test.questionList" :key="question_spec.questionId">
                <b-form-group v-if="question_spec.questionType =='MULTIPLE'">
                    <span>{{ question_spec.questionText }}</span>
                    <b-form-checkbox-group stacked class="px-3" id="checkbox-group-2" :name="'some-checkbox-' + index" v-model="questions[question_spec.questionId]" > <!-- name="flavour-2"-->
                        <b-form-checkbox v-for="answer in question_spec.answerList" :key="answer.answerId"
                                         :value="answer.answerId">
                            <template v-if="answer.answerText">
                                {{ answer.answerText }}
                            </template>
                            <template v-else>
                                {{ $t('notifications.no_translation') }}
                            </template>
                        </b-form-checkbox>
                    </b-form-checkbox-group>
                </b-form-group>
                <b-form-group v-else>
                    <span>{{ question_spec.questionText }}</span>
                    <b-form-radio-group stacked class="px-3" v-model="questions[question_spec.questionId]">
                        <b-form-radio name="some-radios" v-for="answer in question_spec.answerList"
                                      :key="answer.answerId"
                                      :value="answer.answerId">
                            <template v-if="answer.answerText">
                                {{ answer.answerText }}
                            </template>
                            <template v-else>
                                {{ $t('notifications.no_translation') }}
                            </template>
                        </b-form-radio>
                    </b-form-radio-group>
                </b-form-group>
            </div>
            <button @click="submit_test()" class="btn btn-success">
                <i class="fa fa-check" aria-hidden="true"></i>
                {{ $t('lessons.submit_test') }}
            </button>
        </div>
        <div class="test-container" v-else>
            <span>{{ $t('lessons.test_results') }} {{ this.number_of_correct_answers }} / {{ this.number_of_questions }}</span>
            <div class="mt-3" v-for="(question, index) in this.test_results" :key="question.question.question_id">
                <b-form-group class="px-3" :class="setClass(question.true)" v-if="question.question.question_type =='multiple'">
                    <span>{{ question.question.question_text[$root.$i18n.locale] }}</span>
                    <b-form-checkbox-group id="checkbox-group-2" :name="'some-checkbox-'+index"> <!--  name="flavour-2" -->
                        <div class="custom-control custom-checkbox">
                            <div v-for="answer in question.question.answers" :key="answer.answer_id">
                                <input v-if="answer.answer_true == 1" type="checkbox" class="custom-control-input" checked>
                                <input v-else type="checkbox" class="custom-control-input">
                                <label class="custom-control-label">
                                    <template v-if="answer.answer_text[$root.$i18n.locale]">
                                        {{ answer.answer_text[$root.$i18n.locale] }}
                                    </template>
                                    <template v-else>
                                        {{ $t('notifications.no_translation') }}
                                    </template>
                                </label>
                            </div>
                        </div>
                    </b-form-checkbox-group>
                </b-form-group>
                <b-form-group class="px-3" v-else :class="setClass(question.true)">
                    <span>{{ question.question.question_text[$root.$i18n.locale] }}</span>
                    <b-form-radio-group>
                        <div class="custom-control custom-radio">
                            <div v-for="answer in question.question.answers" :key="answer.answer_id">
                                <input v-if="answer.answer_true == 1" type="radio" class="custom-control-input" checked>
                                <input v-else type="radio" class="custom-control-input">
                                <label class="custom-control-label">
                                    <template v-if="answer.answer_text[$root.$i18n.locale]">
                                        {{ answer.answer_text[$root.$i18n.locale] }}
                                    </template>
                                    <template v-else>
                                        {{ $t('notifications.no_translation') }}
                                    </template>
                                </label>
                            </div>
                        </div>
                    </b-form-radio-group>
                </b-form-group>
            </div>
            <button @click="closeTest()" class="btn btn-primary">
                <i class="fa fa-window-close-o" aria-hidden="true"></i>
                {{ $t('lessons.test_close') }}
            </button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: "test",
    components: {},
    props: ['lesson'],
    mounted() {
        this.getTestData();
    },
    data() {
        return {
            test: '',
            questions: {},
            results_in: false,
            number_of_questions: 0,
            number_of_correct_answers: 0,
            test_results: [],
            selected: true,
            not_selected: false
        }
    },
    methods: {
        closeTest() {
            this.$emit('closeTestDialog')
        },
        setClass(param) {
            if(param == true) {
                return "answer-true";
            } else {
                return "answer-false";
            }
        },
        submit_test() {
            let checking = this.$swal.fire({
                toast: true,
                position: "top-end",
                title: this.$t('notifications.wait'),
                onBeforeOpen: () => {
                    this.$swal.showLoading();
                },
            });
            axios.post("/test/submit/" + this.test.test_id,
                {
                    "answers": this.questions
                })
                .then(response => {
                    console.log(response)
                    checking.close();
                    this.results_in = true;

                    this.number_of_questions = response.data.length;

                    let pom = 0;
                    for(let i = 0;i < response.data.length; i++) {
                        if(response.data[i].true == true) {
                            pom = pom + 1;
                        }
                    }

                    this.number_of_correct_answers = pom;
                    this.test_results = response.data
                })
                .catch(e => {
                    console.log(e)
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
        getTestData() {
            axios.get("/test/data/" + this.lesson.testId)
                .then(response => {
                    console.log(response.data[0])
                    this.test = response.data;

                    for (let i = 0; i < this.test.questionList.length; i++) {
                        if (this.test.questionList[i].questionType === "SINGLE") {
                            this.questions[this.test.questionList[i].questionId] = "";
                        } else {
                            this.questions[this.test.questionList[i].questionId] = [];
                        }
                    }

                })
                .catch(e => {
                    console.log(e)
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
    }
};
</script>

<style scoped>

.answer-false {
    border: 1px solid #dc3545;
    border-radius: 5px;
}

.answer-true {
    border: 1px solid #28a745;
    border-radius: 5px;
}

</style>
