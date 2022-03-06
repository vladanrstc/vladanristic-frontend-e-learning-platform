<template>
    <div class="container-fluid text-left">
        <div>
            <b-table striped hover :items="users" :fields="fields">

                <template v-slot:cell(restore)="data">
                    <b-button variant="success" @click="restoreUser(data.item)">
                        <i class="fa fa-undo" aria-hidden="true"></i>
                    </b-button>
                </template>

                <template v-slot:cell(delete)="data">
                    <b-button variant="danger" @click="deleteUser(data.item)">
                        <i class="fa fa-trash" aria-hidden="true"></i>
                    </b-button>
                </template>

            </b-table>
        </div>
        <!--
        <pagination :data="users" @pagination-change-page="getUsers"></pagination>
        -->

    </div>
</template>

<script>
    import axios from "axios";
    import {validationMixin} from "vuelidate";
    import {required, minLength, email} from "vuelidate/lib/validators";

    export default {
        mixins: [validationMixin],
        name: "BannedUsers",
        components: {},
        mounted() {
            this.getUsers();
        },
        data() {
            return {
                roles: [
                    {value: "user", text: "User"},
                    {value: "admin", text: "Admin"},
                ],
                fields: [
                    {
                        key: "delete",
                        sortable: false,
                        label: "Ukloni",
                    },
                    {
                        key: "restore",
                        sortable: false,
                        label: "Aktiviraj",
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
                ],
                users: {},
                user_form: {
                    email: "",
                    password: "",
                    name: "",
                    last_name: "",
                    role: "",
                },
                user_id: '',
                modal_action: "Dodaj korisnika"
            };
        },
        methods: {
            deleteUser(user) {

                this.$swal({
                    title: "Da li ste sigurni da želite da obrišete korisnika?",
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

                        axios.delete("/users/" + user.id).then(() => {
                            creating.close();
                            this.getUsers();
                            this.$swal.fire({
                                toast: true,
                                position: "top-end",
                                icon: "success",
                                title: "Korisnik obrisan!",
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
            restoreUser(user) {

                this.$swal({
                    title: "Da li ste sigurni da želite da aktivirate korisnika?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    cancelButtonText: "Ne",
                    confirmButtonText: "Da, aktiviraj!",
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

                        axios.get("/users/unban/" + user.id).then(() => {
                            creating.close();
                            this.getUsers();
                            this.$swal.fire({
                                toast: true,
                                position: "top-end",
                                icon: "success",
                                title: "Korisnik aktiviran!",
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
            getUsers(page = 1) {
                axios.get("/users-banned?page=" + page).then((response) => {
                    this.users = response.data;
                });
            },
        },
    };
</script>

<style scoped>
</style>
