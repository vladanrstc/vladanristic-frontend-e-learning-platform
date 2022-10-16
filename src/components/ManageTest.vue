<template>
  <div class="container-fluid text-left">
    <div class="d-flex align-items-center mb-3" style="justify-content: space-between">
      <div class="d-flex align-items-center">
        <i v-b-tooltip.hover.bottom title="Test ispunjava zahteve" v-if="test.meets_requirements" class="fa fa-check-circle text-success mr-3" aria-hidden="true"></i>
        <i v-b-tooltip.hover.bottom title="Test ne ispunjava zahteve" v-else class="fa fa-times-circle text-danger mr-3" aria-hidden="true"></i>
        <b-form-input
          style="max-width: 300px"
          class="mr-3"
          id="test-name"
          placeholder="Naslov testa"
          v-model="test_name[lang]"
        ></b-form-input>
        <b-button @click="saveTest()" variant="outline-success" style="min-width:150px">
          <i class="fa fa-floppy-o" aria-hidden="true"></i>
            Sačuvaj naslov
        </b-button>
        <b-button v-if="test.meets_requirements != undefined" @click="removeTest()" class="ml-3" variant="danger">
          <i class="fa fa-times-circle-o" aria-hidden="true"></i>
        </b-button>
      </div>
      <b-button v-if="test.meets_requirements != undefined" @click="questionModal()" class="ml-3" variant="outline-success">
          <i class="fa fa-plus-circle" aria-hidden="true"></i>
          Dodaj pitanje
      </b-button>
    </div>

    <div>
      <b-table striped hover :items="questions.data" :fields="fields">

        <template v-slot:cell(index)="data">
          {{ data.index + 1 }}
        </template>

        <template v-slot:cell(edit)="data">
          <b-button variant="info" @click="questionModal(data.item)">
            <i class="fa fa-pencil" aria-hidden="true"></i>
          </b-button>
        </template>

        <template v-slot:cell(delete)="data">
          <b-button variant="danger" @click="deleteQuestion(data.item)">
            <i class="fa fa-trash" aria-hidden="true"></i>
          </b-button>
        </template>

        <template v-slot:cell(question)="data">
          <b-button variant="success" @click="answerModal(data.item, true)">
            <i class="fa fa-plus" aria-hidden="true"></i>
          </b-button>
        </template>

        <template v-slot:cell(question_text)="data">

          <b-button v-b-toggle="'collapse-a' + data.item.question_id" block variant="info">
            {{data.item.question_text[lang]}}
          </b-button>

          <b-collapse :id="'collapse-a'+data.item.question_id">
            <table class="table table-striped">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">Ukloni</th>
                  <th scope="col">Izmeni</th>
                  <th scope="col">Odgovor</th>
                  <th scope="col">Tačno</th>
                </tr>
              </thead>
              <tbody >
                <tr v-for="answer in data.item.answers" :key="answer.answer_id">
                  <td>
                    <b-button variant="danger" @click="deleteAnswer(answer)">
                      <i class="fa fa-trash" aria-hidden="true"></i>
                    </b-button>
                  </td>
                  <td scope="row">
                    <b-button variant="info" @click="answerModal(answer, false)">
                      <i class="fa fa-pencil" aria-hidden="true"></i>
                    </b-button>
                  </td>

                  <td scope="row">
                    {{ answer.answer_text[lang] }}
                  </td>

                  <td v-if="answer.answer_true == 1" scope="row">
                    <span class="text-success font-weight-bold">DA</span>
                  </td>
                  <td v-else scope="row">
                    <span class="text-danger font-weight-bold">NE</span>
                  </td>

                </tr>
              </tbody>
            </table>
          </b-collapse>

        </template>

      </b-table>
    </div>

    <b-modal
      @hidden="resetModal"
      hide-footer
      id="modal-prevent-closing"
      :title="this.modal_action"
      ref="question_modal"
    >
      <form ref="form" @submit.stop.prevent="addQuestion">
        <b-form-group label="Pitanje">
          <b-form-input
            placeholder="Pitanje"
            v-model="question_text"
          ></b-form-input>

        </b-form-group>

        <button type="submit" class="btn btn-primary login-btn w-100">
            <i class="fa fa-check" aria-hidden="true"></i>
            {{ this.modal_action }}
        </button>
      </form>
    </b-modal>

    <b-modal
      @hidden="resetModalAnswer"
      hide-footer
      id="modal-prevent-closing-2"
      :title="this.modal_action_question"
      ref="answer_modal"
    >
      <form ref="form" @submit.stop.prevent="addAnswer">
        <b-form-group label="Odgovor" class="mb-1">
          <b-form-input
            placeholder="Odgovor"
            v-model="answer_text"
          ></b-form-input>

        </b-form-group>

        <b-form-checkbox
          id="checkbox-1"
          v-model="answer_true"
          name="checkbox-1"
          value="1"
          unchecked-value="0"
          class="mb-3"
        >
          Tačan odgovor
        </b-form-checkbox>

        <button type="submit" class="btn btn-primary login-btn w-100">
            <i class="fa fa-check" aria-hidden="true"></i>
            {{ this.modal_action_question }}
        </button>

      </form>
    </b-modal>

  </div>
</template>

<script>
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required, minLength, email } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],
  name: "ManageTest",
  components: {

  },
  props: ["lesson", "lang"],
  mounted() {
    // this.getQuestions();
    this.getTestData();
  },
  data() {
    return {
      test: {
        "test_name": {
          "sr": "",
          "en": ""
        }
      },
      creating: null,
      answer_true: false,
      test_name: {
        "sr": "",
        "en": ""        
      },
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
          key: "question",
          sortable: false,
          label: "Dodaj odgovor"
        },
        {
          key: "question_text",
          sortable: true,
          label: "Pitanje",
          class: "question-col"
        },
      ],
      question_text: "",
      questions: {},
      question_form: {
        email: "",
        password: "",
        name: "",
        last_name: "",
        role: "",
      },
      question_id: "",
      answer_id: "",
      answer_text: "",
      modal_action: "Dodaj pitanje",
      modal_action_question: "Dodaj odgovor"
    };
  },
  methods: {
    questionModal(question) {

      if(question != null && question != undefined) {
        this.question_text = question.question_text[this.lang]
        this.question_id = question.question_id
        this.modal_action = "Izmeni pitanje"
      } else {
        this.modal_action = "Dodaj pitanje"
      }

      this.$refs["question_modal"].show();
    },
    answerModal(answer, flag) {

      if(flag == false) {
        this.answer_text = answer.answer_text[this.lang]
        this.answer_id = answer.answer_id
        this.answer_true = answer.answer_true
        this.question_id = answer.question_id
        this.modal_action_question = "Izmeni odgovor"
      } else {
        this.answer_id = ''
        this.question_id = answer.question_id
        this.modal_action_question = "Dodaj odgovor"
      }

      this.$refs["answer_modal"].show();
    },
    addQuestion() {

        this.showLoadingToast();

        if(this.question_id == '') {
          let question = null;
          if(this.lang == "sr") {
            question = {
              "question_text": {
                "sr": this.question_text
              },
              "lang": this.lang,
              "test": this.lesson.lesson_test_id
            }
          } else {
            question = {
              "question_text": {
                "en": this.question_text
              },
              "lang": this.lang,
              "test": this.lesson.lesson_test_id
            }
          }

          axios
          .post("/questions", question)
          .then(() => {
            this.creating.close();          
            this.showSuccessMessage("Pitanje uspešno sačuvano!")
            this.getQuestions();
            this.getTestData()
            this.$refs["question_modal"].hide();
            this.question_id = ''
          })
          .catch(() => {
            this.showErrorToast();
        });

      } else {

        this.showLoadingToast();

          let question = null;
          if(this.lang == "sr") {
            question = {
              "question_text": {
                "sr": this.question_text
              },
              "lang": this.lang,
              "question_id": this.question_id
            }
          } else {
            question = {
              "question_text": {
                "en": this.question_text
              },
              "lang": this.lang,
              "question_id": this.question_id
            }
          }
          console.log(question)
          axios
          .patch("/questions/" + this.question_id, question)
          .then(() => {
            this.creating.close();            
            this.showSuccessMessage("Pitanje uspešno sačuvano!")
            this.getQuestions();
            this.getTestData()
            this.$refs["question_modal"].hide();
            this.question_id = ''
          })
          .catch(() => {
            this.showErrorToast();
          });

      }
    },
    addAnswer() {

        let creating = this.$swal.fire({
          toast: true,
          position: "top-end",
          title: "Molimo sačekajte..",
          onBeforeOpen: () => {
            this.$swal.showLoading();
          },
        });

        if(this.answer_id == '') {
          let answer = null;
          if(this.lang == "sr") {
            answer = {
              "answer_text": {
                "sr": this.answer_text
              },
              "answer_true": this.answer_true,
              "lang": this.lang,
              "question": this.question_id
            }
          } else {
            answer = {
              "answer_text": {
                "en": this.answer_text
              },
              "answer_true": this.answer_true,
              "lang": this.lang,
              "question": this.question_id
            }
          }
          console.log(answer)
          axios
          .post("/answers", answer)
          .then(() => {
            this.creating.close();                    
            this.showSuccessMessage("Odgovor uspešno sačuvan!")
            this.getQuestions();
            this.getTestData()
            this.$refs["answer_modal"].hide();
          })
          .catch(() => {
            this.showErrorToast();
        });

      } else {

        this.showLoadingToast();

          let answer = null;
          if(this.lang == "sr") {
            answer = {
              "answer_text": {
                "sr": this.answer_text
              },
              "answer_true": this.answer_true,
              "lang": this.lang,
              "question": this.question_id
            }
          } else {
            answer = {
              "answer_text": {
                "en": this.answer_text
              },
              "answer_true": this.answer_true,
              "lang": this.lang,
              "question": this.question_id
            }
          }
          console.log(answer)
          axios
          .patch("/answers/" + this.answer_id, answer)
          .then(() => {
            this.creating.close();            
            this.showSuccessMessage("Pitanje uspešno sačuvano!")
            this.getQuestions();
            this.getTestData()
            this.$refs["answer_modal"].hide();
          })
          .catch(() => {
            this.showErrorToast();
          });

      }
    },
    saveTest() {

        this.showLoadingToast();

        let test = {
          "test_name": this.test_name,
          "lesson_id": this.lesson.lesson_id,
          "lang": this.lang
        }

        axios
          .post("/tests/admin/store-or-update", test)
          .then(res => {
            this.lesson.lesson_test_id = res.data.test_id
            this.test = res.data
            this.creating.close();
            // this.getQuestions();
            this.showSuccessMessage("Test uspešno sačuvan!")
            this.getTestData();
          })
          .catch(() => {
            this.showErrorToast();
          });

    },
    removeTest() {
      this.$swal({
        title: "Da li ste sigurni da želite da obrišete test?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        cancelButtonText: "Ne",
        confirmButtonText: "Da, obriši!",
      }).then((result) => {
        if (result.value) {
          this.showLoadingToast();

          axios
            .delete("/tests/admin/" + this.test.test_id + "/delete")
            .then(() => {
              this.creating.close();
              this.lesson.lesson_test_id = ''
              this.questions = []
              this.showSuccessMessage("Test obrisan!")
              this.getTestData();
            })
            .catch(() => {
              this.showErrorToast();
            });
        }
      });
    },
    deleteQuestion(question) {
      this.$swal({
        title: "Da li ste sigurni da želite da obrišete pitanje?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        cancelButtonText: "Ne",
        confirmButtonText: "Da, obriši!",
      }).then((result) => {
        if (result.value) {
          

          axios
            .delete("/questions/" + question.question_id)
            .then(() => {
              this.creating.close();              
              this.getQuestions();
              this.getTestData()
              this.showSuccessMessage("Pitanje obrisano!")
            })
            .catch(() => {
              this.showErrorToast();
            });
        }
      });
    },
    deleteAnswer(answer) {
      this.$swal({
        title: "Da li ste sigurni da želite da obrišete odgovor?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        cancelButtonText: "Ne",
        confirmButtonText: "Da, obriši!",
      }).then((result) => {
        if (result.value) {
          this.showLoadingToast();

          axios
            .delete("/answers/" + answer.answer_id)
            .then(() => {
              this.closeLoadingToast();
              this.getQuestions();
              this.getTestData()
              this.showSuccessMessage("Odgovor obrisan!")
            })
            .catch(() => {
              this.showErrorToast();
            });
        }
      });
    },
    editUser(question) {
      this.question_form.name = question.name;
      this.question_form.last_name = question.last_name;
      this.question_form.email = question.email;
      this.question_form.role = question.role;

      this.question_id = question.id;

      this.modal_action = "Izmeni pitanje";

      this.$refs["create_question"].show();
    },
    validateState(name) {
      const { $dirty, $error } = this.$v.question_form[name];
      return $dirty ? !$error : null;
    },
    getQuestions() {
      axios.get("/questions/test/" + this.lesson.lesson_test_id).then((response) => {
        console.log("---------")
        console.log(response)
        this.questions = response;
      });
    },
    resetModal() {
      this.question_form = {
        email: "",
        password: "",
        name: "",
        last_name: "",
        role: "",
      };
      this.question_id = "";
      this.question_text = "";
      this.$v.question_form.$reset();
      this.modal_action = "Dodaj pitanje";
    },
    resetModalAnswer() {
      this.answer_text = ''
      this.answer_true = false
    },
    getTestData() {
      this.showLoadingToast();
      axios.get("/tests/admin/" + this.lesson.lesson_id + "/show").then((response) => {
        if(response.data != null && response.data != "") {
          this.test = response.data.data
          try {
            this.test_name[this.lang] = response.data.data.test_name[this.lang]
          } catch(e) {

          }
        }
        this.closeLoadingToast();
      });
    },
    showErrorToast() {
        this.$swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Došlo je do greške. Molimo pokušajte ponovo",
          showConfirmButton: false,
          timer: 4500,
        });
    },
    showSuccessMessage(messageText) {
      this.$swal.fire({
        toast: true,
        timer: 3000,
        position: "top-end",
        icon: "success",
        title: messageText,
        showConfirmButton: false,
      });
    },
    showLoadingToast() {
      this.creating = this.$swal.fire({
        toast: true,
        position: "top-end",
        title: "Molimo sačekajte..",
        onBeforeOpen: () => {
          this.$swal.showLoading();
        },
      });
    },
    closeLoadingToast() {
      this.creating.close();
    }
  },
  validations: {
    question_form: {
      email: {
        required,
        email,
        minLength: minLength(3),
      },
      name: {
        required,
        minLength: minLength(3),
      },
      last_name: {
        required,
        minLength: minLength(3),
      },
      password: {
        required,
        minLength: minLength(8),
      },
    },
  },
};
</script>

<style>
  .question-col {
    width: 75%;
  }
  .question-col > button {
    min-height: 38px;
  }
</style>
