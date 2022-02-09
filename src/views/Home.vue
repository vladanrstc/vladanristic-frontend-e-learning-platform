<template>
    <div class="home">
        <section id="hero-section" class="d-flex justify-content-center align-items-center">
            <div id="hero-backdrop" class="position-absolute"></div>
            <div class="d-flex justify-content-space-between">
                <div>
                    <img src="../assets/logo.png" loading="lazy" class="img-fluid">
                </div>
                <div class="text-white pb-5 pb-lg-0">
                    <h1>{{ $t("hero.title") }}</h1>
                    <h5>{{ $t("hero.subtitle") }}</h5>
                </div>
            </div>
        </section>
        <section id="offers-section" class="py-5 my-0 my-lg-5">
            <h1 class="pb-lg-5">{{ $t("benefits.benefit_title") }}</h1>
            <div class="container">
                <div class="row">
                    <div class="col col-12 col-md-4">
                        <i class="fa fa-file-pdf-o register-icon" aria-hidden="true"></i>
                        <h5 class="font-weight-bold">
                            {{ $t("benefits.benefit_title_1") }}
                        </h5>
                        <p>{{ $t("benefits.benefit_text_1") }}</p>
                    </div>
                    <div class="col col-12 col-md-4">
                        <i class="fa fa-pencil register-icon" aria-hidden="true"></i>
                        <h5 class="font-weight-bold">
                            {{ $t("benefits.benefit_title_2") }}
                        </h5>
                        <p>{{ $t("benefits.benefit_text_2") }}</p>
                    </div>
                    <div class="col col-12 col-md-4">
                        <i class="fa fa-thumbs-up register-icon" aria-hidden="true"></i>
                        <h5 class="font-weight-bold">
                            {{ $t("benefits.benefit_title_3") }}
                        </h5>
                        <p>{{ $t("benefits.benefit_text_3") }}</p>
                    </div>
                </div>
            </div>

        </section>

    </div>
</template>

<script>

export default {

    name: 'Home',
    methods: {},
    mounted() {

        if (localStorage.getItem("lang") != null && localStorage.getItem("lang") != undefined) {
            this.$i18n.locale = localStorage.getItem("lang");
        }

        if (this.$route.params.token != undefined) {

            this.$swal.fire({
                position: 'center',
                icon: 'success',
                title: this.$t('notifications.confirm_account_success'),
                showConfirmButton: true,
                onClose: () => {
                    this.$router.push('/')
                }
            })

        }

    }

}
</script>

<style scoped>

.register-icon {
    font-size: 70px;
    margin-bottom: 1rem;
}

#hero-section {
    background-image: url("../assets/bg-banner.jpg");
    min-height: 600px;
    background-position: center;
    background-size: cover;
    position: relative;
}

#hero-backdrop {
    background-color: #000000a1;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.justify-content-space-between {
    justify-content: space-around;
    flex-direction: column;
    z-index: 9;
}

@media (max-width: 768px) {
    #hero-section {
        min-height: calc(100vh - 60px);
    }
}

#hero-section > div.d-flex {
    margin-top: 75px;
}

.copyright {
    background-color: #2a3e57;
    color: #ffffff;
}

</style>
