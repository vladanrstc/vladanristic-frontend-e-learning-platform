<template>
  <div class="container-fluid text-left">
    <div class="d-flex align-items-center mb-3" style="justify-content: space-between">
      <div class="d-flex align-items-center">
        <i v-b-tooltip.hover.bottom title="Test ispunjava zahteve" v-if="this.test_verified == true" class="fa fa-check-circle text-success mr-3" aria-hidden="true"></i>
        <i v-b-tooltip.hover.bottom title="Test ne ispunjava zahteve" v-else class="fa fa-times-circle text-danger mr-3" aria-hidden="true"></i>
        <b-form-input
          style="max-width: 300px"
          class="mr-3"
          id="test-name"
          placeholder="Naslov testa"
          v-model="test_name"
        ></b-form-input>
        <b-button @click="saveTest()" variant="success" style="min-width:150px">
          <i class="fa fa-floppy-o" aria-hidden="true"></i>
            Sačuvaj naslov
        </b-button>
        <b-button v-if="lesson.lesson_test_id > 0" @click="removeTest()" class="ml-3" variant="danger">
          <i class="fa fa-times-circle-o" aria-hidden="true"></i>
        </b-button>
      </div>
      <b-button v-if="lesson.lesson_test_id > 0" @click="questionModal()" class="ml-3" variant="success">
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
            {{data.item.question_text[selected_lang]}}
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
                    {{ answer.answer_text[selected_lang] }}
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
    this.selected_lang = this.lang
    this.getQuestions();
    if(this.lesson.lesson_test_id != null) {
      this.get_test_data();
    }
    this.getTestStatus();
  },
  data() {
    return {
      test_verified: false,
      answer_true: false,
      selected_lang: "sr",
      test_name: "",
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
        this.question_text = question.question_text[this.selected_lang]
        this.question_id = question.question_id
        this.modal_action = "Izmeni pitanje"
      } else {
        this.modal_action = "Dodaj pitanje"
      }

      this.$refs["question_modal"].show();
    },
    answerModal(answer, flag) {

      if(flag == false) {
        this.answer_text = answer.answer_text[this.selected_lang]
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
    get_test_data() {
      axios
          .get("/tests/" + this.lesson.lesson_test_id)
          .then(res => {
            this.test_name = res.data.test_name[this.selected_lang];
          })
          .catch(()=> {
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
    addQuestion() {

        let creating = this.$swal.fire({
          toast: true,
          position: "top-end",
          title: "Molimo sačekajte..",
          onBeforeOpen: () => {
            this.$swal.showLoading();
          },
        });

        if(this.question_id == '') {
          let question = null;
          if(this.selected_lang == "sr") {
            question = {
              "question_text": {
                "sr": this.question_text
              },
              "lang": this.selected_lang,
              "test": this.lesson.lesson_test_id
            }
          } else {
            question = {
              "question_text": {
                "en": this.question_text
              },
              "lang": this.selected_lang,
              "test": this.lesson.lesson_test_id
            }
          }

          axios
          .post("/questions", question)
          .then(() => {
            creating.close();
            this.$swal.fire({
                toast: true,
                timer: 3000,
                position: "top-end",
                icon: "success",
                title: "Uspešno sačuvano pitanje!",
                showConfirmButton: false,
              });
            this.getQuestions();
            this.getTestStatus()
            this.$refs["question_modal"].hide();
            this.question_id = ''
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

        let creating = this.$swal.fire({
          toast: true,
          position: "top-end",
          title: "Molimo sačekajte..",
          onBeforeOpen: () => {
            this.$swal.showLoading();
          },
        });

          let question = null;
          if(this.selected_lang == "sr") {
            question = {
              "question_text": {
                "sr": this.question_text
              },
              "lang": this.selected_lang,
              "question_id": this.question_id
            }
          } else {
            question = {
              "question_text": {
                "en": this.question_text
              },
              "lang": this.selected_lang,
              "question_id": this.question_id
            }
          }
          console.log(question)
          axios
          .patch("/questions/" + this.question_id, question)
          .then(() => {
            creating.close();
            this.$swal.fire({
                toast: true,
                timer: 3000,
                position: "top-end",
                icon: "success",
                title: "Uspešno sačuvano pitanje!",
                showConfirmButton: false,
              });
            this.getQuestions();
            this.getTestStatus()
            this.$refs["question_modal"].hide();
            this.question_id = ''
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
          if(this.selected_lang == "sr") {
            answer = {
              "answer_text": {
                "sr": this.answer_text
              },
              "answer_true": this.answer_true,
              "lang": this.selected_lang,
              "question": this.question_id
            }
          } else {
            answer = {
              "answer_text": {
                "en": this.answer_text
              },
              "answer_true": this.answer_true,
              "lang": this.selected_lang,
              "question": this.question_id
            }
          }
          console.log(answer)
          axios
          .post("/answers", answer)
          .then(() => {
            creating.close();
            this.$swal.fire({
                toast: true,
                timer: 3000,
                position: "top-end",
                icon: "success",
                title: "Uspešno sačuvan odgovor!",
                showConfirmButton: false,
              });
            this.getQuestions();
            this.getTestStatus()
            this.$refs["answer_modal"].hide();
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

        let creating = this.$swal.fire({
          toast: true,
          position: "top-end",
          title: "Molimo sačekajte..",
          onBeforeOpen: () => {
            this.$swal.showLoading();
          },
        });

          let answer = null;
          if(this.selected_lang == "sr") {
            answer = {
              "answer_text": {
                "sr": this.answer_text
              },
              "answer_true": this.answer_true,
              "lang": this.selected_lang,
              "question": this.question_id
            }
          } else {
            answer = {
              "answer_text": {
                "en": this.answer_text
              },
              "answer_true": this.answer_true,
              "lang": this.selected_lang,
              "question": this.question_id
            }
          }
          console.log(answer)
          axios
          .patch("/answers/" + this.answer_id, answer)
          .then(() => {
            creating.close();
            this.$swal.fire({
                toast: true,
                timer: 3000,
                position: "top-end",
                icon: "success",
                title: "Uspešno sačuvano pitanje!",
                showConfirmButton: false,
              });
            this.getQuestions();
            this.getTestStatus()
            this.$refs["answer_modal"].hide();
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
    },
    saveTest() {

        let creating = this.$swal.fire({
          toast: true,
          position: "top-end",
          title: "Molimo sačekajte..",
          onBeforeOpen: () => {
            this.$swal.showLoading();
          },
        });

        let test = null;
        let sel_lang = this.selected_lang;
        if(this.lesson.lesson_test_id == undefined) {

          if(this.selected_lang == "sr") {
            test = {
              "test_name": {
                "sr": this.test_name
              },
              "test_description": "-",
              "lesson_id": this.lesson.lesson_id,
              "lang": sel_lang
            }
          } else {
            test = {
              "test_name": {
                "en": this.test_name
              },
              "test_description": "-",
              "lesson_id": this.lesson.lesson_id,
              "lang": sel_lang
            }
          }

          axios
          .post("/tests",test)
          .then(res => {
            this.lesson.lesson_test_id = res.data.test_id
            creating.close();
            this.getQuestions();
            this.$swal.fire({
                toast: true,
                timer: 3000,
                position: "top-end",
                icon: "success",
                title: "Uspešno sačuvan test!",
                showConfirmButton: false,
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

        } else {

          if(this.selected_lang == "en") {
            test = {
              "test_id": this.lesson_test_id,
              "lang": sel_lang,
              "test_name": {
                "en": this.test_name
              },
              "test_description": "-"
            }
          } else {
            test = {
              "test_id": this.lesson_test_id,
              "lang": sel_lang,
              "test_name": {
                "sr": this.test_name
              },
              "test_description": "-"
            }
          }


          axios
          .patch("/tests/" + this.lesson.lesson_test_id,test)
          .then(res => {
            console.log(res)
            creating.close();
            this.$swal.fire({
                toast: true,
                timer: 3000,
                position: "top-end",
                icon: "success",
                title: "Uspešno sačuvan test!",
                showConfirmButton: false,
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

      }


    },
    removeTest() {
      this.$swal({
        title: "Da li ste sigurni da želite da obrišete test?",
        icon: "warning",
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
            .delete("/tests/" + this.lesson.lesson_test_id)
            .then(() => {
              creating.close();
              this.lesson.lesson_test_id = ''
              this.test_name = ''
              this.questions = []
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

          this.$swal(
            "Obrisan test!",
            '',
            "success"
          );
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
          let creating = this.$swal.fire({
            toast: true,
            position: "top-end",
            title: "Molimo sačekajte..",
            onBeforeOpen: () => {
              this.$swal.showLoading();
            },
          });

          axios
            .delete("/questions/" + question.question_id)
            .then(() => {
              creating.close();
              this.getQuestions();
              this.getTestStatus()
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

          this.$swal(
            "Obrisano pitanje!",
            '',
            "success"
          );
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
          let creating = this.$swal.fire({
            toast: true,
            position: "top-end",
            title: "Molimo sačekajte..",
            onBeforeOpen: () => {
              this.$swal.showLoading();
            },
          });

          axios
            .delete("/answers/" + answer.answer_id)
            .then(() => {
              creating.close();
              this.getQuestions();
              this.getTestStatus()
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

          this.$swal(
            "Obrisan odgovor!",
            '',
            "success"
          );
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
    getTestStatus() {
      axios.get("/test/status/" + this.lesson.lesson_test_id).then((response) => {
          console.log("MUDA")
          console.log(response)
          this.test_verified = response.data.meets_requirements;
      });
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
