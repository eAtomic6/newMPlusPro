<template>
    <div class="main">
        <topbar 
            :back="back" 
            :title="title" 
            @goBack="goBack"
        ></topbar>
        <customer-component></customer-component>
    </div>
</template>

<script>
    import topbar from "@/components/topbar";
    import { MIXINS } from "@/assets/JS/mixins";
    import customerComponent from '@/components/customerComponent';

    export default {
        name: 'customerFollowUp',
        mixins: [MIXINS],
        components: {
            topbar,
            customerComponent
        },
        data() {
            return {
                back: true,
                title: "客户跟进"
            }
        }
    }
</script>
