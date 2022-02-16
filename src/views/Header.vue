<template>
    <div id="top-holder">
        <div id="navbar-holder" class="container">
            <b-navbar class="container w-100 bg-white py-3" toggleable="lg">

                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
                <b-navbar-brand>vladanristic.com</b-navbar-brand>

                <div id="navbar-content-holder">
                    <b-collapse id="nav-collapse" is-nav>
                        <b-navbar-nav>
                            <b-nav-item to="/" exact>{{ $t("navigation.home") }}</b-nav-item>
                            <b-nav-item to="/about">{{ $t("navigation.about") }}</b-nav-item>
                            <b-nav-item to="/contact">{{ $t("navigation.contact") }}</b-nav-item>
                            <b-nav-item class="btn-nav rounded-pill px-2" to="/courses">{{
                                    $t("navigation.lessons")
                                }}
                            </b-nav-item>
                            <b-nav-item class="btn-nav rounded-pill px-2" @click="goToYT()">{{
                                    $t("navigation.youtube")
                                }}
                            </b-nav-item>
                            <b-nav-item>
                                <b-dropdown id="dropdown-lang" class="m-lg-2 language-selector">
                                    <b-dropdown-item v-on:click="setLang('en')">
                                        <img src="https://cdn.countryflags.com/thumbs/united-kingdom/flag-800.png">
                                        English
                                    </b-dropdown-item>
                                    <b-dropdown-item v-on:click="setLang('sr')">
                                        <img src="https://cdn.countryflags.com/thumbs/serbia/flag-400.png">
                                        Serbian
                                    </b-dropdown-item>
                                </b-dropdown>
                            </b-nav-item>
                            <b-nav-item v-if="this.loginStatusFlag == false">
                                <button type="button" class="btn btn-link" @click="openLoginModal()">
                                    {{ $t("navigation.login") }}
                                </button>
                            </b-nav-item>
                            <b-nav-item v-if="this.loginStatusFlag == true">
                                <edit-profile></edit-profile>
                            </b-nav-item>
                        </b-navbar-nav>
                    </b-collapse>
                </div>

            </b-navbar>
        </div>

        <b-modal size="md" centered ref="forgot_password_modal" id="forgot_password_modal" hide-footer>
            <template v-slot:modal-title>
                {{ $t('navigation.reset_password') }}
            </template>
            <form @submit="sendResetEmail">
                <b-form-input
                    id="example-input-134"
                    name="example-input-134"
                    :placeholder="$t('input_fields.email')"
                    v-model="$v.reset_password.email.$model"
                    :state="validateState2('email')"
                    aria-describedby="input-134-live-feedback"
                ></b-form-input>

                <b-form-invalid-feedback id="input-134-live-feedback">
                    {{ $t('input_field_errors.email') }}
                </b-form-invalid-feedback>
                <button type="submit" class="btn btn-success w-100 mt-3">
                    {{ $t('navigation.reset_password') }}
                    <i class="fa fa-envelope-o" aria-hidden="true"></i>
                </button>
            </form>
        </b-modal>

        <b-modal size="md" centered ref="login_modal" id="login_modal" hide-footer>
            <template v-slot:modal-title>
                {{ $t('navigation.login') }} / {{ $t('navigation.signup') }}
            </template>
            <b-tabs content-class="mt-3">
                <b-tab :title="$t('navigation.login')" active>
                    <form @submit="login">
                        <div class="form-group">
                            <label for="exampleInputEmail1">{{ $t('input_fields.email') }}</label>
                            <input v-model="form.email" type="email" class="form-control" id="exampleInputEmail1"
                                   aria-describedby="emailHelp" :placeholder="$t('input_fields.email')">
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">{{ $t('input_fields.password') }}</label>
                            <input v-model="form.password" type="password" class="form-control"
                                   id="exampleInputPassword1" :placeholder="$t('input_fields.password')">
                        </div>
                        <button type="submit" class="btn btn-primary login-btn w-100">
                            <i class="fa fa-sign-in" aria-hidden="true"></i>
                            {{ $t('navigation.login_btn') }}
                        </button>
                        <div class="text-right pt-2">
                            <a @click="forgotPasswordModal()" href="#"><small>{{
                                    $t('navigation.login_forgot_password')
                                }}</small></a>
                        </div>
                    </form>
                </b-tab>
                <b-tab :title="$t('navigation.signup')">
                    <form @submit.stop.prevent="register">
                        <b-form-group id="example-input-group-1" :label="$t('input_fields.email')"
                                      label-for="example-input-1">

                            <b-form-input
                                id="example-input-1"
                                name="example-input-1"
                                :placeholder="$t('input_fields.email')"
                                v-model="$v.register_form.email.$model"
                                :state="validateState('email')"
                                aria-describedby="input-1-live-feedback"
                            ></b-form-input>

                            <b-form-invalid-feedback id="input-1-live-feedback">
                                {{ $t('input_field_errors.email') }}
                            </b-form-invalid-feedback>
                        </b-form-group>

                        <b-form-group id="example-input-group-2" :label="$t('input_fields.name')"
                                      label-for="example-input-2">

                            <b-form-input
                                id="example-input-2"
                                name="example-input-2"
                                :placeholder="$t('input_fields.name')"
                                v-model="$v.register_form.name.$model"
                                :state="validateState('name')"
                                aria-describedby="input-2-live-feedback"
                            ></b-form-input>

                            <b-form-invalid-feedback id="input-2-live-feedback">
                                {{ $t('input_field_errors.min-3') }}
                            </b-form-invalid-feedback>

                        </b-form-group>

                        <b-form-group id="example-input-group-3" :label="$t('input_fields.lastName')"
                                      label-for="example-input-3">

                            <b-form-input
                                id="example-input-3"
                                name="example-input-3"
                                :placeholder="$t('input_fields.lastName')"
                                v-model="$v.register_form.lastName.$model"
                                :state="validateState('lastName')"
                                aria-describedby="input-3-live-feedback"
                            ></b-form-input>

                            <b-form-invalid-feedback id="input-3-live-feedback">
                                {{ $t('input_field_errors.min-3') }}
                            </b-form-invalid-feedback>

                        </b-form-group>

                        <b-form-group id="example-input-group-4" :label="$t('input_fields.password')"
                                      label-for="example-input-4">

                            <b-form-input
                                type="password"
                                id="example-input-4"
                                name="example-input-4"
                                :placeholder="$t('input_fields.password')"
                                v-model="$v.register_form.password.$model"
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
                                v-model="$v.register_form.password_repeat.$model"
                                :state="validateState('password_repeat')"
                                aria-describedby="input-5-live-feedback"
                            ></b-form-input>

                            <b-form-invalid-feedback id="input-5-live-feedback">
                                {{ $t('input_field_errors.min-8') }}
                                {{ $t('input_field_errors.password_repeat') }}
                            </b-form-invalid-feedback>

                        </b-form-group>
                        <button type="submit" class="btn btn-primary login-btn w-100">
                            <i class="fa fa-user-plus" aria-hidden="true"></i>
                            {{ $t('navigation.signup_btn') }}
                        </button>
                    </form>
                </b-tab>
            </b-tabs>
        </b-modal>
    </div>
</template>

<script>

import axios from 'axios'
import {validationMixin} from "vuelidate";
import {required, minLength, email, sameAs} from "vuelidate/lib/validators";
import EditProfile from "../components/EditProfile.vue";

export default {
    mixins: [validationMixin],
    name: 'Navigation',
    data() {
        return {
            current_email: "",
            loginStatusFlag: false,
            langs: ['en', 'sr'],
            langName: "Language",
            globe: '<img src="https://cdn.countryflags.com/thumbs/serbia/flag-400.png">',
            form: {
                email: "",
                password: ""
            },
            register_form: {
                email: "",
                password: "",
                password_repeat: "",
                name: "",
                lastName: ""
            },
            reset_password: {
                email: ""
            },
            logged_user_name: ""
        }
    },
    validations: {
        register_form: {
            email: {
                required,
                email,
            },
            name: {
                required,
            },
            lastName: {
                required,
            },
            password: {
                required,
                minLength: minLength(8)
            },
            password_repeat: {
                required,
                minLength: minLength(8),
                sameAsPassword: sameAs('password')
            },
        },
        reset_password: {
            email: {
                required,
                email,
                minLength: minLength(3)
            },
        },
    },
    methods: {
        goToYT() {
             window.open("https://www.youtube.com/channel/UCL_tYimzYRUX_PdSzi0N4-A/featured?view_as=subscriber")
        },
        sendResetEmail(evt) {
            evt.preventDefault();
            let sendEmail = this.$swal.fire({
                toast: true,
                position: 'top-end',
                title: this.$t('notifications.wait'),
                onBeforeOpen: () => {
                    this.$swal.showLoading();
                }
            });
            console.log(this.reset_password.email)
            axios.post('/reset-password', {
                email: this.reset_password.email,
            }).then(response => {

                sendEmail.close();
                this.$swal.fire({
                    toast: false,
                    position: 'center',
                    icon: 'success',
                    title: this.$t('notifications.reset_email_sent'),
                    showConfirmButton: true,
                })

                this.$refs['forgot_password_modal'].hide()

            }).catch(error => {
                console.log(error)
                this.$swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: this.$t('notifications.general_error'),
                    showConfirmButton: false,
                    timer: 3500
                })
            });

        },
        forgotPasswordModal() {
            this.$refs['forgot_password_modal'].show()
            this.$refs['login_modal'].hide()
        },
        setLang(langg) {
            localStorage.setItem("lang", langg);
            if (langg == "sr") {
                this.globe = '<img src="https://cdn.countryflags.com/thumbs/serbia/flag-400.png">';
            } else {
                this.globe = '<img src="https://cdn.countryflags.com/thumbs/united-kingdom/flag-800.png">';
            }

            this.$i18n.locale = langg;
        },
        openLoginModal() {
            this.$refs['login_modal'].show()
        },
        login(evt) {
            evt.preventDefault();

            let loggingIn = this.$swal.fire({
                toast: true,
                position: 'top-end',
                title: this.$t('notifications.logging_in'),
                onBeforeOpen: () => {
                    this.$swal.showLoading();
                }
            });
            
            let formData = new FormData();
            formData.append('email', this.form.email)
            formData.append('password', this.form.password)

            axios.post('/login', formData).then(response => {
                console.log(response)
                if (response.data.flag == false) {

                    this.$swal.fire({
                        toast: false,
                        position: 'center',
                        icon: 'warning',
                        title: this.$t('notifications.confirm_account_first'),
                        showConfirmButton: true,
                    });
                    return;

                }

                loggingIn.close();
                this.$swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: this.$t('notifications.login_success') + "!",
                    showConfirmButton: false,
                    timer: 3500
                })

                this.$refs['login_modal'].hide()

                localStorage.setItem("ac_t", response.data.access_token)

                this.getLoginStatus();

                axios.get('/logged/user').then(response => {
                    console.log(response)
                    localStorage.setItem("name", response.data.name)
                    localStorage.setItem("fn", response.data.name)
                    localStorage.setItem("lastName", response.data.lastName)
                    localStorage.setItem("ln", response.data.lastName)
                    this.logged_user_name = response.data.name;
                    location.reload();
                }).catch((err) => {

                });


            }).catch((err) => {
                console.log(err)
                this.$swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: this.$t('notifications.login_error'),
                    showConfirmButton: false,
                    timer: 3500
                })
            });

        },
        register() {

            this.$v.register_form.$touch();

            if (!this.$v.register_form.$anyError) {

                let registering = this.$swal.fire({
                    toast: true,
                    position: 'top-end',
                    title: this.$t('notifications.wait'),
                    onBeforeOpen: () => {
                        this.$swal.showLoading();
                    }
                });

                let reg_form = this.register_form;
                reg_form.language = this.$i18n.locale;

                axios.post('/register', reg_form).then(response => {
                    console.log(response)
                    registering.close();
                    this.$swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: this.$t('notifications.register_success'),
                        showConfirmButton: true
                    })

                    this.$refs['login_modal'].hide()

                }).catch(error => {
                    console.log(error)
                    if (error.response.status == 401) {
                        this.$swal.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'error',
                            title: this.$t('notifications.email_exists'),
                            showConfirmButton: false,
                            timer: 3500
                        })
                        return;
                    }

                    this.$swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'error',
                        title: this.$t('notifications.general_error'),
                        showConfirmButton: false,
                        timer: 3500
                    })
                });

            }

        },
        validateState(name) {
            const {$dirty, $error} = this.$v.register_form[name];
            return $dirty ? !$error : null;
        },
        validateState2(name) {
            const {$dirty, $error} = this.$v.reset_password[name];
            return $dirty ? !$error : null;
        },
        getLoginStatus() {
            if (localStorage.getItem("ac_t") != undefined) {
                this.loginStatusFlag = true;
            } else {
                this.loginStatusFlag = false;
            }
        },

    },
    components: {
        EditProfile
    },
    mounted() {
        this.getLoginStatus();
    }

}
</script>

<style>

.navbar-nav .dropdown-menu {
    position: absolute !important;
    float: unset !important;
}

.dropdown-menu > li > a > img {
    max-width: 25px;
}

.login-btn {
    background-color: #3273a8 !important;
}

.login-btn:hover {
    background-color: #ffffff !important;
    color: #3273a8 !important;
    border: 1px solid #3273a8 !important;
}

.dropdown-toggle::after {
    display: none !important;
}

.language-selector > button {
    background-color: #ffffff !important;
    border: unset;
}

.language-selector {
    width: 100%;
}

#top-holder {
    min-height: 75px;
    min-width: 100%;
    position: fixed;
    width: 100%;
    background-color: #ffffff;
    z-index: 99;
    display: flex;
    align-items: center;
    box-shadow: 0 3px 6px -2px grey;
}

#navbar-content-holder {
    width: 100%;
}

#navbar-content-holder > div {
    justify-content: flex-end;
}

.btn-nav {
    margin-top: 5px;
    margin-bottom: 5px;
}

.btn-nav > a {
    background-color: #3273a8;
    border: 1px solid #3273a8;
    font-weight: bold;
    border-radius: 50rem !important;
}

@media (max-width: 992px) {
    .navbar-nav .dropdown-menu {
        left: 0;
        right: 0;
        text-align: center;
        max-width: 30%;
        margin: 0 auto;
    }
}

@media (max-width: 1200px) {
    .btn-nav > a {
        max-width: 130px;
        margin: 0 auto;
    }
}

@media (min-width: 1000px) {

    .nav-item {
        display: flex;
        align-items: center;
    }

}

.btn-nav:hover > a {
    background-color: #ffffff;
}

.btn-nav:hover > a {
    color: #3273a8 !important;
}

.btn-nav > a {
    color: #ffffff !important;
}

.nav-item {
    margin-left: 5px;
    margin-right: 5px;
}

#dropdown-lang__BV_toggle_ {
    background-image: url(https://upload.wikimedia.org/wikipedia/en/6/6b/Terrestrial_globe.svg);
    width: 30px;
    height: 30px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
}

</style>
