<template>
    <div class="container">
        <topbar :title="title" :back="getBack" v-on:goBack="goBack"></topbar>
        <div class="main">
            <div class="search iconfont">
                <input type="text" placeholder="请输入搜索关键字" @click="goSearch">
            </div>
            <c-scroll :data="dataList.list" :total="dataList.total" :listenScroll="true" class="content" @scrollToEnd="moreData">
                <div>
                    <p class="list-num">共 <span>{{dataList.total}}</span> 条记录</p>
                    <building :house="dataList.list" :boObject="true"></building>
                </div>
            </c-scroll>
        </div>
    </div>
</template>

<script>
    // import { SCROLL } from '@/assets/JS/scroll'
    import { MIXINS } from '@/assets/JS/mixins'
    import topbar from '@/components/topbar'
    import building from '@/components/building'
    import {mapMutations} from 'vuex';
    export default {
        name: 'intentProject',
        mixins: [MIXINS],
        components: {
            topbar,
            building
        },
        data() {
            return {
                title: '意向项目',
                getBack: true,
                num: 16,
                house: [
                {
                    id: 1,
                    name: '东湖景园',
                    address: '武昌-水果湖',
                    buildingPrice: 28000,
                    location: '万达',
                    tips: ['带看为准', '实时楼盘']
                }, ],
                dataList: {
                    list: []
                },
                toal: 20,
                keyword: '',
            }
        },
        methods: {
            goSearch() {
                this.$router.push({
                    path: '/search',
                    query: {
                        title: this.title,
                        c_search:1
                    }
                })
            },
            getData() {
                this.$ajax.get('/api/intentionalProject', {
                    keyword: this.keyword,
                    pageNum: 1,
                    pageSize: this.toal
                }).then(res => {
                    res = res.data
                    if (res.status === 200) {
                        this.dataList = res.data
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 下拉加载
            moreData() {
                // if (this.dataList.hasNextPage) {
                    this.$ajax.get('/api/intentionalProject', {
                        keyword: this.keyword,
                        pageNum: this.dataList.pageNum + 1,
                        pageSize: this.toal
                    }).then(res => {
                        res = res.data
                        if (res.status === 200) {
                            Object.assign(this.dataList, res.data, {
                                list: [...this.dataList.list, ...res.data.list]
                            })
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                // }
            },
            // 返回
            goBack(){
                this.changeStoreCType(2);
                this.$router.go(-1);
            },
            ...mapMutations(['changeStoreCType'])
        },
        mounted() {
            this.getData();
        },
    }
</script>

<style scoped lang="less">
    @import '~@/assets/CSS/config';

    .container {
        .main {
            background: #fff;
            // position: absolute;
            z-index: 10;
        }

        .search {
            height: 108px;
            text-align: center;
            position: relative;

            &:before {
                content: '\e60b';
                position: absolute;
                color: @color-assist;
                top: 50%;
                left: 40px;
                transform: translateY(-38px);
                font-size: @font-size-icon;
            }

            input {
                margin: 16px 0 38px 0;
                width: 690px;
                height: 70px;
                line-height: 70px;
                border-radius: 10px;
                box-sizing: border-box;
                padding-left: 73px;
                outline: none;
                border: none;
                background: rgba(237, 237, 238, 1);

                &::-webkit-input-placeholder {
                    color: @color-assist;
                    font-size: @font-size-m;
                }
            }
        }

        .content {
            position: absolute;
            top: 204px;
            bottom: 0;
            left: 0;
            right: 0;
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;

            .list-num {
                padding: 0 30px;
                height: 50px;
                line-height: 50px;
                font-size: 24px;
                color: @color-assist;
                background: @bg-f5;

                >span {
                    position: relative;
                    top: 3px;
                    @font-size-h2();
                    color: @color-orange;
                }
            }
        }
    }
</style>