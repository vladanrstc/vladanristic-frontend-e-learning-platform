<template>
    <div>
        <b-dropdown id="dropdown-1" dropleft variant="light" class="m-md-2 p-0">
            <template slot="button-content">
                <img :src="'https://eu.ui-avatars.com/api/?name=' + this.name + '+' + this.lastName" class="img-fluid rounded-circle"
                     style="width:25px;height:25px">
            </template>
            <b-dropdown-item @click="profileModal()">
                <i class="fa fa-user" aria-hidden="true"></i>
                {{ $t("navigation.profile") }}
            </b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="logout()">
                <i class="fa fa-power-off" aria-hidden="true"></i>
                {{ $t("navigation.logout") }}
            </b-dropdown-item>
        </b-dropdown>

        <b-modal hide-footer id="modal-prevent-closing-edit-profile" ref="edit_profile"
                 :title="$t('navigation.profile')">
            <form ref="form" @submit.stop.prevent="editProfile">
                <b-form-group id="example-input-group-1" :label="$t('input_fields.email')" label-for="example-input-1">
                    <b-form-input
                    disabled
                        id="example-input-1"
                        name="example-input-1"
                        :placeholder="$t('input_fields.email')"
                        v-model="$v.user_form.email.$model"
                        :state="validateState('email')"
                        aria-describedby="input-1-live-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="input-1-live-feedback">
                        {{ $t('input_field_errors.email') }}
                    </b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="example-input-group-2" :label="$t('input_fields.name')" label-for="example-input-2">
                    <b-form-input
                        id="example-input-2"
                        name="example-input-2"
                        :placeholder="$t('input_fields.name')"
                        v-model="$v.user_form.name.$model"
                        :state="validateState('name')"
                        aria-describedby="input-2-live-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="input-2-live-feedback">
                        {{ $t('input_field_errors.min-3') }}
                    </b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="example-input-group-3" label="Prezime"
                              label-for="example-input-3">

                    <b-form-input
                        id="example-input-3"
                        name="example-input-3"
                        placeholder="Prezime"
                        v-model="$v.user_form.lastName.$model"
                        :state="validateState('lastName')"
                        aria-describedby="input-3-live-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="input-3-live-feedback">
                        {{ $t('input_field_errors.min-3') }}
                    </b-form-invalid-feedback>

                </b-form-group>

                <b-form-group id="example-input-group-14" :label="$t('input_fields.current_password')"
                              label-for="example-input-14">

                    <b-form-input
                        type="password"
                        id="example-input-14"
                        name="example-input-14"
                        :placeholder="$t('input_fields.current_password')"
                        v-model="$v.user_form.currentPassword.$model"
                        :state="validateState('currentPassword')"
                        aria-describedby="input-14-live-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="input-4-live-feedback">
                        {{ $t('input_field_errors.min-8') }}
                    </b-form-invalid-feedback>

                </b-form-group>

                <b-form-group id="example-input-group-4" :label="$t('input_fields.password')"
                              label-for="example-input-4">

                    <b-form-input
                        type="password"
                        id="example-input-4"
                        name="example-input-4"
                        :placeholder="$t('input_fields.password')"
                        v-model="$v.user_form.password.$model"
                        :state="validateState('password')"
                        aria-describedby="input-4-live-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="input-4-live-feedback">
                        {{ $t('input_field_errors.min-8') }}
                    </b-form-invalid-feedback>

                </b-form-group>

                <b-form-group id="example-input-group-5" :label="$t('input_fields.password_repeat')"
                              label-for="example-input-5">

                    <b-form-input
                        type="password"
                        id="example-input-5"
                        name="example-input-5"
                        :placeholder="$t('input_fields.password_repeat')"
                        v-model="$v.user_form.passwordRepeat.$model"
                        :state="validateState('passwordRepeat')"
                        aria-describedby="input-5-live-feedback"
                    ></b-form-input>

                    <b-form-invalid-feedback id="input-5-live-feedback">
                        {{ $t('input_field_errors.min-8') }}
                        {{ $t('input_field_errors.password_repeat') }}
                    </b-form-invalid-feedback>

                </b-form-group>

                <button type="submit" class="btn btn-primary login-btn w-100">
                    <i class="fa fa-check-circle-o" aria-hidden="true"></i>
                    {{ $t("buttons.save") }}
                </button>
            </form>
        </b-modal>

    </div>
</template>

<script>

    import {email, minLength, required, sameAs} from "vuelidate/lib/validators";
    import axios from "axios";

    export default {
        name: 'EditProfile',
        mounted() {
            this.name = localStorage.getItem("fn");
            this.lastName = localStorage.getItem("ln");
        },
        components: {},
        data() {
            return {
                name: 'N',
                lastName: 'A',
                user_form: {
                    email: "",
                    currentPassword: "",
                    password: "",
                    passwordRepeat: "",
                    name: "",
                    lastName: ""
                },
            }
        },
        methods: {
            getLoggedUser() {
                axios.get("/logged/user").then(response => {
                    console.log(response)
                    this.user_form.email = response.data.email
                    this.user_form.name = response.data.name
                    this.user_form.lastName = response.data.lastName

                    console.log(this.user_form)
                    console.log(response.data)
                    this.$refs['edit_profile'].show();
                })
            },
            validateState(name) {
                const {$dirty, $error} = this.$v.user_form[name];
                return $dirty ? !$error : null;
            },
            profileModal() {
                this.getLoggedUser()
            },
            logout() {
                localStorage.removeItem("ac_t");
                location.href = "/";
            },
            editProfile() {
                if (!this.$v.user_form.$anyError) {

                    if(this.user_form.password != this.user_form.passwordRepeat && this.user_form.password != '') {
                        this.$swal.fire({
                            toast: true,
                            position: "top-end",
                            icon: "error",
                            title: this.$t("input_field_errors.password_repeat"),
                            showConfirmButton: false,
                            timer: 4500,
                        });
                        return;
                    }

                    let creating = this.$swal.fire({
                        toast: true,
                        position: "top-end",
                        title: this.$t("notifications.wait"),
                        onBeforeOpen: () => {
                            this.$swal.showLoading();
                        },
                    });
                    console.log(this.user_form)
                    axios
                        .put("/logged/user", this.user_form)
                        .then(() => {
                            creating.close();
                            this.$swal.fire({
                                toast: true,
                                timer: 3000,
                                position: "top-end",
                                icon: "success",
                                title: this.$t("notifications.edit_profile_success"),
                                showConfirmButton: false,
                            });

                            this.getLoggedUser();

                        })
                        .catch(error => {
                            console.log(error)
                            if(error.response.status == 401) {
                                this.$swal.fire({
                                    toast: true,
                                    position: 'top-end',
                                    icon: 'error',
                                    title: this.$t('input_field_errors.current_password_error'),
                                    showConfirmButton: false,
                                    timer: 3500
                                })
                                return;
                            }
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
        },
        validations: {
            user_form: {
                email: {
                    required,
                    email,
                    minLength: minLength(3)
                },
                name: {
                    required,
                    minLength: minLength(3)
                },
                lastName: {
                    required,
                    minLength: minLength(3)
                },
                password: {

                },
                passwordRepeat: {

                },
                currentPassword: {

                },
            }
        },
    }
</script>

<style scope>
    .dropleft .dropdown-toggle::before {
        content: unset !important;
    }

    .btn-light {
        background-color: transparent !important;
    }

    .dropdown-toggle {
        padding: 0px !important;
    }
</style>
