<script>
import Axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  data() {
    return {
      accessToken: null,
      refreshToken: null,
      meteringPoints: [],
      meteringPointId: null,
      collapse: 1
    }
  },

  methods: {
    promptRefreshToken() {
      ElMessageBox.prompt('Indtast dit  Kunde-API token', 'Kunde-API token', {
        confirmButtonText: 'OK',
        showCancelButton: false,
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        closeOnHashChange: false
      })
      .then(({ value }) => {
        this.fetchAccessToken(value);
      })
    },
  
    fetchAccessToken(refreshToken) {
      Axios.get('http://localhost:4000/token?token=' + refreshToken)
      .then((response) => {
        this.accessToken = response.data.accessToken;
      }, () => {
        this.promptRefreshToken();
      });
    },

    fetchMeteringPoints(accessToken) {
      Axios.get('http://localhost:4000/meteringpoints?token=' + accessToken)
      .then((response) => {
        this.meteringPoints = response.data.meteringPoints;
        this.meteringPointId = ((this.meteringPoints || [])[0] || {}).meteringPointId;
      });
    },
    
    fetchTimeSeries(accessToken) {
      Axios.post('http://localhost:4000/gettimeseries?token=' + accessToken, {
        from: '2022-01-01',
        to: '2022-06-21',
        aggregation: 'Year'
      })
      .then((response) => {
      console.log(response);
      });
    }
  },

  watch: {
    refreshToken(after, before) {
      localStorage.setItem('refreshToken', after);
      if(after) {
        this.fetchAccessToken(after);
      }
    },

    accessToken(after, before) {
      if(after) {
        this.fetchMeteringPoints(after);
      }
    },

    meteringPointId(after, before) {
    if(after) {
    this.fetchTimeSeries(this.accessToken);
    }

    }
  },

  mounted() {
   this.refreshToken = localStorage.getItem('refreshToken');
   if(!this.refreshToken) {
     this.promptRefreshToken();
   }
  }
}
</script> 

<template>
<div>
{{ meteringPointId}}
<el-select v-model="meteringPointId" class="m-2" placeholder="Select">
<el-option
v-for="item in meteringPoints"
:key="item.meteringPointId"
:label="item.balanceSupplierName"
:value="item.meteringPointId"
/>
</el-select>
<el-button>Indeværende år</el-button>
<el-button>Indeværende måned</el-button>
<el-button>Forrige måned</el-button>
</div>
</template>
