<template>
    <div class="container-fluid text-left">
        <div class="d-flex" style="justify-content: space-between">
            <div class="d-flex">
                <b-button v-b-modal.modal-prevent-closing class="mb-3 mr-3" variant="success" style="width:250px">
                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                    Dodaj korisnika
                </b-button>
                <!-- <b-form-input v-debounce:500ms="searchUsers" debounce-events="input" v-model="search_text_bre" placeholder="Pretraga..."></b-form-input>-->
            </div>
            <b-button v-b-modal.modal-prevent-closing-banned-users class="mb-3" variant="danger">
                <i class="fa fa-search-plus" aria-hidden="true"></i>
                Suspendovani korisnici
            </b-button>
        </div>

        <div>
            <b-table striped hover :items="users" :fields="fields">

                <template v-slot:cell(edit)="data">
                    <b-button variant="info" @click="editUser(data.item)">
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                    </b-button>
                </template>

                <template v-slot:cell(delete)="data">
                    <b-button variant="danger" @click="deleteUser(data.item)">
                        <i class="fa fa-trash" aria-hidden="true"></i>
                    </b-button>
                </template>

                <template v-slot:cell(ban)="data">
                    <b-button variant="danger" @click="banUser(data.item)">
                        <i class="fa fa-ban" aria-hidden="true"></i>
                    </b-button>
                </template>

            </b-table>
        </div>
        <!--
        <pagination :data="users" @pagination-change-page="getUsers"></pagination>
        -->

        <!-- MODAL -->
        <b-modal @hidden="resetModal" hide-footer id="modal-prevent-closing" ref="create_user"
                 :title="this.modal_action">
            <form ref="form" @submit.stop.prevent="addUser">
                <b-form-group id="example-input-group-1" label="E-mail" label-for="example-input-1">
                    <b-form-input
                        id="example-input-1"
                        name="example-input-1"
                        placeholder="e-mail"
                        v-model="$v.user_form.email.$model"
                        :state="validateState('email')"
                        aria-describedby="input-1-live-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="input-1-live-feedback">E-mail je obavezan</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="example-input-group-2" label="Ime" label-for="example-input-2">
                    <b-form-input
                        id="example-input-2"
                        name="example-input-2"
                        placeholder="Ime"
                        v-model="$v.user_form.name.$model"
                        :state="validateState('name')"
                        aria-describedby="input-2-live-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="input-2-live-feedback">Ime je obavezno polje</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="example-input-group-3" label="Prezime" label-for="example-input-3">
                    <b-form-input
                        id="example-input-3"
                        name="example-input-3"
                        placeholder="Prezime"
                        v-model="$v.user_form.lastName.$model"
                        :state="validateState('lastName')"
                        aria-describedby="input-3-live-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="input-3-live-feedback">Prezime je obavezno polje
                    </b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="example-input-group-4" label="Lozinka" label-for="example-input-4">
                    <b-form-input
                        type="password"
                        id="example-input-4"
                        name="example-input-4"
                        placeholder="Lozinka"
                        v-model="$v.user_form.password.$model"
                        :state="validateState('password')"
                        aria-describedby="input-4-live-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback
                        id="input-4-live-feedback"
                    >Lozinka mora sadržati makar 8 karaktera
                    </b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="example-input-group-5" label="Rola" label-for="example-input-5">
                    <b-form-select
                        id="example-input-5"
                        v-model="user_form.role"
                        :options="roles"
                        size="md"
                    ></b-form-select>
                </b-form-group>

                <!--
                <b-form-group id="example-input-group-67" label="Jezik" label-for="example-input-67">
                    <b-form-select
                        id="example-input-67"
                        v-model="user_form.language"
                        :options="languages"
                        size="md"
                    ></b-form-select>
                </b-form-group>
                -->

                <button type="submit" class="btn btn-primary login-btn w-100">
                    <i class="fa fa-user-plus" v-if="this.modal_action == 'Dodaj korisnika'" aria-hidden="true"></i>
                    <i class="fa fa-pencil" v-if="this.modal_action == 'Izmeni korisnika'" aria-hidden="true"></i>
                    {{ this.modal_action }}
                </button>
            </form>
        </b-modal>

        <b-modal
            hide-footer
            id="modal-prevent-closing-banned-users"
            ref="banned-users"
            size="xl"
            title="Suspendovani korisnici"
            @hidden="getUsers"
        >
            <bannedUsers></bannedUsers>
        </b-modal>
    </div>
</template>

<script>
    import axios from "axios";
    import {validationMixin} from "vuelidate";
    import {required, minLength, email} from "vuelidate/lib/validators";
    import bannedUsers from "./BannedUsers"


    export default {
        mixins: [validationMixin],
        name: "AdminUsers",
        components: {
            bannedUsers
        },
        mounted() {
            this.getUsers();
        },
        data() {
            return {
                search_text_bre: "",
                roles: [
                    {value: "user", text: "User"},
                    {value: "admin", text: "Admin"},
                ],
                languages: [
                    {value: "sr", text: "Srpski"},
                    {value: "en", text: "Engleski"},
                ],
                fields: [
                    {
                        key: "ban",
                        sortable: false,
                        label: "Suspenduj",
                    },
                    {
                        key: "edit",
                        sortable: false,
                        label: "Izmeni",
                    },
                    {
                        key: "lastName",
                        sortable: true,
                        label: "Prezime",
                    },
                    {
                        key: "name",
                        sortable: true,
                        label: "Ime",
                    },
                    {
                        key: "email",
                        label: "E-mail",
                        sortable: true,
                    },
                    {
                        key: "role",
                        label: "Rola",
                        sortable: true,
                    },
                    /*{
                        key: "language",
                        label: "Jezik",
                        sortable: false,
                    },*/
                ],
                users: {},
                user_form: {
                    email: "",
                    password: "",
                    name: "",
                    lastName: "",
                    role: "",
                    // language: "",
                },
                user_id: '',
                modal_action: "Dodaj korisnika"
            };
        },
        methods: {
            searchUsers() {
              this.getUsers();
            },
            banUser(user) {

                this.$swal({
                    title: "Da li ste sigurni da želite da suspendujete korisnika?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    cancelButtonText: "Ne",
                    confirmButtonText: "Da, suspenduj!",
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

                        axios.delete("/users/ban/" + user.id).then(() => {
                            creating.close();
                            this.getUsers();
                            this.$swal.fire({
                                toast: true,
                                position: "top-end",
                                icon: "success",
                                title: "Korisnik suspendovan!",
                                showConfirmButton: false,
                                timer: 4500,
                            });
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
            editUser(user) {

                this.user_form.name = user.name;
                this.user_form.lastName = user.lastName;
                this.user_form.email = user.email;
                this.user_form.role = user.role;
                // this.user_form.language = user.language;

                this.user_id = user.id;

                this.modal_action = "Izmeni korisnika"

                this.$refs["create_user"].show();

            },
            validateState(name) {
                const {$dirty, $error} = this.$v.user_form[name];
                return $dirty ? !$error : null;
            },
            addUser() {

                if (this.user_id == '') {
                    this.$v.user_form.$touch();
                }

                if (!this.$v.user_form.$anyError) {
                    let creating = this.$swal.fire({
                        toast: true,
                        position: "top-end",
                        title: "Molimo sačekajte..",
                        onBeforeOpen: () => {
                            this.$swal.showLoading();
                        },
                    });

                    if (this.user_id == '') {

                        axios.post("/users", this.user_form)
                            .then(() => {
                                creating.close();
                                this.$swal.fire({
                                    toast: true,
                                    timer: 3000,
                                    position: "top-end",
                                    icon: "success",
                                    title: "Uspešno dodat korisnik",
                                    showConfirmButton: false,
                                });

                                this.getUsers();

                                this.$refs["create_user"].hide();
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

                        this.user_form.id = this.user_id;

                        console.log(this.user_form)

                        axios.patch("/users/" + this.user_id, this.user_form)
                            .then(() => {
                                creating.close();
                                this.$swal.fire({
                                    toast: true,
                                    timer: 3000,
                                    position: "top-end",
                                    icon: "success",
                                    title: "Uspešno izmenjen korisnik",
                                    showConfirmButton: false,
                                });

                                this.getUsers();

                                this.$refs["create_user"].hide();

                                this.user_id = ''
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
            getUsers(page = 1) {
                axios.get("/users").then((response) => {
                    console.log(response)
                    this.users = response.data;
                });
            },
            resetModal() {
                this.user_form = {
                    email: "",
                    password: "",
                    name: "",
                    lastName: "",
                    role: "",
                    //language: "",
                }
                this.user_id = ''
                this.$v.user_form.$reset();
                this.modal_action = "Dodaj korisnika"
            }
        },
        validations: {
            user_form: {
                email: {
                    required,
                    email,
                    minLength: minLength(3),
                },
                name: {
                    required,
                    minLength: minLength(3),
                },
                lastName: {
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

<style scoped>
</style>
