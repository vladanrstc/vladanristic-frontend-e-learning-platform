<template>
    <div class="about container pb-3">
        <img src="../assets/about_img.jpg" class="img-fluid author-image mb-3 mr-md-3">

        <div class="text-justify">
            <p v-html="$t('about.p1')">

            </p>
            <p v-html="$t('about.p2')">

            </p>
            <p class="float-left" v-html="$t('about.p3')">

            </p>
            <p style="clear: both" v-html="$t('about.p4')">

            </p>
            <p v-html="$t('about.p5')">

            </p>
            <p v-html="$t('about.p6')">

            </p>
            <p v-html="$t('about.p7')">

            </p>
            <p v-html="$t('about.p8')">

            </p>
            <p v-html="$t('about.p9')">

            </p>
        </div>
    </div>
</template>
<style>
@media (min-width: 650px) {
    .author-image {
        max-width: 300px !important;
        float:left;
    }
}

@media (max-width: 649px) {
    .author-image {
        max-width: 90% !important;
    }
}

.about {
    padding-top: 130px !important;
}

</style>
