<template>
    <div class="info-top" v-show="useAuthStore().isAuth">
        <i class="fa-solid fa-user"></i> &nbsp;  {{useAuthStore().getName}} &nbsp; &nbsp; <span class="d-none d-sm-inline">|</span>
        <button class="btn btn-default white" @click="useAuthStore().logOut">
            <i class="fa fa-sign-out" aria-hidden="true"></i>
        </button>
    </div>
</template>

<style scoped lang="scss">
.info-top{
    position: absolute;
    top:0px;
    right: 0px;
    color: #FFF;
    padding: 10px 20px 0 0 ;
    font-size: 14px;
    font-weight: bold;
}

.white{
    color: #CCC;
}
@media (max-width: 426px) {
    .info-top{
        position: absolute;
        top:$header-height+10px;
        /*left: 30px;*/
        color: #FFF;
        padding: 10px 20px 0 0 ;
        font-size: 14px;
        font-weight: bold;
        width: 100%;
        text-align: center;
    }
  }
</style>