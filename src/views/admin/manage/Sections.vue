<template>
  <div class="container-fluid text-left">
    <div class="mb-3 w-100 d-flex align-items-center">
      <b-button variant="danger" class="mr-3" @click="backToCourses()">
        <i class="fa fa-chevron-circle-left" aria-hidden="true"></i>
          Nazad na kurseve
      </b-button>
      <b-button v-b-modal.modal-prevent-closing variant="success">
        <i class="fa fa-plus-circle" aria-hidden="true"></i>
        Dodaj sekciju
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
      <table class="table table-striped">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Ukloni</th>
            <th scope="col">Izmeni</th>
            <th scope="col">Lekcije</th>
            <th scope="col">Naziv</th>
          </tr>
        </thead>
        <draggable v-model="sections" @end="saveOrder()" tag="tbody">
          <tr v-for="section in sections" :key="section.sectionId">

            <td>
              <b-button variant="danger" @click="deleteSection(section)">
                <i class="fa fa-trash" aria-hidden="true"></i>
              </b-button>
            </td>
            <td scope="row">
              <b-button variant="info" @click="editSection(section)">
                <i class="fa fa-pencil" aria-hidden="true"></i>
              </b-button>
            </td>

            <td scope="row">
              <b-button variant="info" @click="goToLessons(section)">
                <i class="fa fa-file-video-o" aria-hidden="true"></i>
              </b-button>
            </td>
            <td>{{ section.sectionName }}</td>
          </tr>
        </draggable>
      </table>
    </div>

    <!-- MODAL -->
    <b-modal
      @hidden="resetModal"
      hide-footer
      id="modal-prevent-closing"
      ref="create_section"
      :title="this.modal_action"
    >
      <form ref="form" @submit.stop.prevent="addSection">
        <b-form-group id="example-input-group-1" label="Naziv" label-for="example-input-1">
          <b-form-input
            id="example-input-1"
            name="example-input-1"
            placeholder="Naziv sekcije"
            v-model="$v.section_form.sectionName.$model"
            :state="validateState('sectionName')"
            aria-describedby="input-1-live-feedback"
          ></b-form-input>

          <b-form-invalid-feedback id="input-1-live-feedback">Naziv sekcije je obavezan</b-form-invalid-feedback>
        </b-form-group>

        <button type="submit" class="btn btn-primary login-btn w-100">

          <i
            class="fa fa-plus-circle"
            v-if="this.modal_action == 'Dodaj sekciju'"
            aria-hidden="true"
          ></i>
          <i class="fa fa-pencil" v-if="this.modal_action == 'Izmeni sekciju'" aria-hidden="true"></i>
            {{ this.modal_action }}
        </button>
      </form>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import draggable from "vuedraggable";

export default {
  mixins: [validationMixin],
  name: "AdminSections",
  components: {
    draggable,
  },
  mounted() {
    this.courseId = this.$route.params.course;
    this.getSections();
  },
  data() {
    return {
      courseId: "",
      selected_lang: "sr",
      options: [
        { text: "SR", value: "sr" },
        { text: "EN", value: "en" },
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
          key: "sectionName",
          sortable: true,
          label: "Naziv sekcije",
        },
      ],
      sections: [],
      section_form: {
        sectionName: "",
      },
      sectionId: "",
      modal_action: "Dodaj sekciju",
    };
  },
  methods: {
    goToLessons(section) {
      this.$router.push("/admin/sections/" + this.courseId + "/lessons/" + section.sectionId)
    },
    backToCourses() {
      this.$router.push("/admin/courses")
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
        .post("/sections/order",{
          sections: this.sections
        })
        .then((response) => {
          updating.close();

          console.log(response.data)

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
    deleteSection(section) {
      this.$swal({
        title: "Da li ste sigurni da želite da obrišete sekciju?",
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
            .delete("/sections/" + section.sectionId)
            .then(() => {
              creating.close();
              this.getSections();
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

          this.$swal("Obrisana sekcija!", "", "success");
        }
      });
    },
    editSection(section) {
      this.section_form.sectionName = section.sectionName;
      this.sectionId = section.sectionId;
      this.modal_action = "Izmeni sekciju";
      this.$refs["create_section"].show();
    },
    validateState(name) {
      console.log(this.section_form);
      const { $dirty, $error } = this.$v.section_form[name];
      return $dirty ? !$error : null;
    },
    addSection() {
      if (this.sectionId == "") {
        this.$v.section_form.$touch();
      }

      if (!this.$v.section_form.$anyError) {
        let creating = this.$swal.fire({
          toast: true,
          position: "top-end",
          title: "Molimo sačekajte..",
          onBeforeOpen: () => {
            this.$swal.showLoading();
          },
        });

        this.section_form.sectionCourseId = this.courseId;

        console.log(this.section_form)

        if (this.sectionId == "") {
          axios
            .post("/sections", this.section_form)
            .then(() => {
              creating.close();
              this.$swal.fire({
                toast: true,
                timer: 3000,
                position: "top-end",
                icon: "success",
                title: "Uspešno dodata sekcija",
                showConfirmButton: false,
              });

              this.getSections();

              this.$refs["create_section"].hide();
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
          this.section_form.sectionId = this.sectionId;

          axios
            .patch("/sections/" + this.sectionId, this.section_form)
            .then((res) => {
              console.log(res);
              creating.close();
              this.$swal.fire({
                toast: true,
                timer: 3000,
                position: "top-end",
                icon: "success",
                title: "Uspešno izmenjena sekcija",
                showConfirmButton: false,
              });

              this.getSections();

              this.$refs["create_section"].hide();

              this.sectionId = "";
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
    getSections() {
      axios.get("/sections/course/" + this.courseId).then((response) => {
        console.log(response);
        this.sections = response.data;
      });
    },
    resetModal() {
      this.sectionId = "";

      this.modal_action = "Dodaj sekciju";
    },
  },
  validations: {
    section_form: {
      sectionName: {},
    },
  },
};
</script>

<style scoped>
</style>
