<template>
    <div class="contact pb-4 container">
        <h1 class="mb-3">{{ $t('contact.heading') }}</h1>
        <b-form @submit="sendMessage" class="form-container">
            <div class="row text-left">

                <div class="col col-12 col-md-6">
                    <b-form-group id="input-group-2">
                        <b-form-input
                            id="input-2"
                            v-model="$v.form.name.$model"
                            :state="validateState('name')"
                            required
                            :placeholder="$t('input_fields.name')"
                        ></b-form-input>
                        <b-form-invalid-feedback id="input-1-live-feedback">
                            {{ $t('input_field_errors.required') }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </div>

                <div class="col col-12 col-md-6">
                    <b-form-group>
                        <b-form-input
                            id="input-2"
                            v-model="$v.form.last_name.$model"
                            :state="validateState('last_name')"
                            required
                            :placeholder="$t('input_fields.last_name')"
                        ></b-form-input>
                        <b-form-invalid-feedback id="input-2-live-feedback">
                            {{ $t('input_field_errors.required') }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </div>

            </div>

            <div class="row text-left">
                <div class="col col-12">
                    <b-form-group>
                        <b-form-input
                            id="input-2"
                            v-model="$v.form.email.$model"
                            :state="validateState('email')"
                            required
                            :placeholder="$t('input_fields.email')"
                        ></b-form-input>
                        <b-form-invalid-feedback id="input-3-live-feedback">
                            {{ $t('input_field_errors.email') }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                </div>
            </div>
            <b-form-group>
                <b-form-textarea
                    id="textarea"
                    v-model="$v.form.message.$model"
                    :state="validateState('message')"
                    :placeholder="$t('input_fields.message')"
                    size="md"
                    rows="5"
                ></b-form-textarea>
                <b-form-invalid-feedback id="input-4-live-feedback">
                    {{ $t('input_field_errors.required') }}
                </b-form-invalid-feedback>
            </b-form-group>
            <div class="d-flex justify-content-end">
                <b-button type="submit" class="mt-3" variant="success">
                    <i class="fa fa-envelope-o" aria-hidden="true"></i>
                    {{ $t('buttons.send_msg') }}
                </b-button>
            </div>
        </b-form>
    </div>
</template>
<script>
import axios from 'axios'
import {validationMixin} from "vuelidate";
import {required, minLength, email, sameAs} from "vuelidate/lib/validators";

export default {
    mixins: [validationMixin],
    data() {
        return {
            form: {
                email: '',
                name: '',
                last_name: '',
                message: ''
            }
        }
    },
    created() {

    },
    methods: {
        sendMessage(evt) {

            evt.preventDefault();
            let sendMessage = this.$swal.fire({
                toast: true,
                position: 'top-end',
                title: this.$t('notifications.wait'),
                onBeforeOpen: () => {
                    this.$swal.showLoading();
                }
            });
            console.log(this.form)
            axios.post('/message', this.form).then(response => {

                sendMessage.close();
                this.$swal.fire({
                    toast: false,
                    position: 'center',
                    icon: 'success',
                    title: this.$t('notifications.message_sent'),
                    showConfirmButton: true,
                })

                this.form.name = "";
                this.form.last_name = "";
                this.form.email = "";
                this.form.message = "";
                this.$v.form.$reset();

            }).catch(error => {
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
        validateState(name) {
            const {$dirty, $error} = this.$v.form[name];
            return $dirty ? !$error : null;
        },
    },
    validations: {
        form: {
            email: {
                required,
                email,
                minLength: minLength(3)
            },
            name: {
                required,
            },
            last_name: {
                required,
            },
            message: {
                required,
            },
        },
    },

}
</script>
<style>
@media (min-width: 650px) {
    .form-container {
        margin: 0 auto;
        max-width: 600px !important;
    }
}

@media (max-width: 649px) {
    .author-image {
        max-width: 90% !important;
    }
}

.contact {
    padding-top: 130px !important;
}

</style>
