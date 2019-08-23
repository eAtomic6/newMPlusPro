<template>
    <ul class="list">
        <li v-for="item in getList" :key="item.id">
            <div>
                <img class="img" :src="getImgUrl(item.head_img)" />
                <div>
                    <div class="txt">
                        <p class="pc-name">{{item.pc_name}}（{{item.pc_dep_name}}）</p>
                        <p :class="item.state === '无效报备' ?'p1':'p2'">{{item.state}}</p>
                    </div>
                    <p class="gray">{{item.create_time}}</p>
                </div>
            </div>
            <ul class="ul">
                <li>报备项目：{{item.b_name}}</li>
                <li>剩余时间：{{item.remaining}}</li>
                <li>项目状态：{{item.project_state}}</li>
                <li>
                    <div v-if="item.reporting_type == 2">定点保护期：{{item.period_time}}</div>
                    <div v-else>{{txtprops}}保护期：{{item.valid_time}}小时</div>
                </li>
                <li>楼盘性质：{{item.building_property}}</li>
                <li v-if="item.expect_look_time" class="tooLong">预计带看时间：{{item.expect_look_time}}</li>
                <li v-if="(item.reject_remark&&item.state=='驳回报备')||(item.reject_remark&&item.state=='驳回带看')" class="tooLong">驳回原因：{{item.reject_remark}}</li>
            </ul>
        </li>
    </ul>
</template>

<script>
    const imgUrl = require('@/assets/img/customer-default.png')
    export default {
        name: 'customerInfoList',
        props: {
            list: {
                type: Array,
                default: []
            },
            txtprops:{
                type:String,
                default:'报备'
            }
        },
        computed: {
            getList() {
                return this.list
            }
        },
        methods: {
            getImgUrl(url = imgUrl) {
                if (url !== '') {
                    return url
                }
                return imgUrl
            },
            getTxt(index) {
                switch (index)
                {
                    case 0:
                        return '报备中'
                        break;
                    case 1:
                        return '有效报备'
                        break;
                    default:
                        return '无效报备'
                }
            }
        }
    }
</script>

<style scoped lang="less">
    @import "~@/assets/CSS/config";

    .list {
        background-color: @bg-f5;
        >li {
            margin-top: 20px;
            padding: 40px 30px 0;
            background-color: @bg-ff;

            .img {
                width: 88px;
                height: 88px;
                float: left;
                margin-right: 24px;
                border-radius: 50%;
                background-image: url(../assets/img/customer-default.png);
                background-size: 88px auto;
            }

            >div:first-child {
                overflow: hidden;
            }

            .txt {
                display: flex;
                justify-content: space-between;
                line-height: 50px;

                .pc-name {
                    width: 500px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .p1 {
                    font-size: @font-size-s;
                    color: @color-orange;
                    padding-bottom: 4px;
                    width: @font-size-s * 6;
                    text-align: right;
                }

                .p2 {
                    .p1;
                    color: @color-red;
                    text-align: right;
                    width: @font-size-s * 6;
                }
            }

            .gray {
                color: @color-assist;
                font-size: @font-size-s;
            }

            .ul {
                overflow: hidden;
                padding: 22px 0 32px;

                >li {
                    float: left;
                    width: 345px;
                    font-size: @font-size-m;
                    color: @color-minor;
                    line-height: 45px;
                    height: 45px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;

                    &.tooLong {
                        width: 100%;
                        height: auto;
                        white-space: normal;
                        word-wrap: break-word;
                        word-break: break-all;
                    }
                }
            }
        }

        >li:first-child {
            margin-top: 0;
        }
    }
</style>