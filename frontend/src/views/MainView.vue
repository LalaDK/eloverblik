<script>
import Axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  data () {
    return {
      accessToken: null,
      refreshToken: null,
      meteringPoints: [],
      meteringPointId: null,
      timeseries: null
    }
  },

  methods: {
    promptRefreshToken () {
      ElMessageBox.prompt('Indtast dit  Kunde-API token', 'Kunde-API token', {
        confirmButtonText: 'OK',
        showCancelButton: false,
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        closeOnHashChange: false
      })
        .then(({ value }) => {
          this.fetchAccessToken(value)
        })
    },

    fetchAccessToken (refreshToken) {
      Axios.get('http://localhost:4000/token?token=' + refreshToken)
        .then((response) => {
          this.accessToken = response.data.accessToken
        }, () => {
          this.promptRefreshToken()
        })
    },

    fetchMeteringPoints (accessToken) {
      Axios.get('http://localhost:4000/meteringpoints?token=' + accessToken)
        .then((response) => {
          this.meteringPoints = response.data.meteringPoints
          this.meteringPointId = ((this.meteringPoints || [])[0] || {}).meteringPointId
        })
    },

    fetchTimeSeries (accessToken) {
      Axios.post('http://localhost:4000/gettimeseries?token=' + accessToken, {
        from: Date.create('beginning of year').format('%Y-%m-%d'),
        to: Date.create('tomorrow').format('%Y-%m-%d'),
        aggregation: 'Year',
        meteringPoint: this.meteringPointId
      })
        .then((response) => {
          this.timeseries = response.data
        })
    }
  },

  watch: {
    refreshToken (after, before) {
      localStorage.setItem('refreshToken', after)
      if (after) {
        this.fetchAccessToken(after)
      }
    },

    accessToken (after, before) {
      if (after) {
        this.fetchMeteringPoints(after)
      }
    },

    meteringPointId (after, before) {
      if (after) {
        this.fetchTimeSeries(this.accessToken)
      }
    }
  },

  mounted () {
    this.refreshToken = localStorage.getItem('refreshToken')
    if (!this.refreshToken) {
      this.promptRefreshToken()
    }
  }
}
</script>

<template>
<div>
<el-row>
<el-col :span="24">
<el-select v-model="meteringPointId" class="m-2" placeholder="Select" style="display: block;">
<el-option
v-for="item in meteringPoints"
:key="item.meteringPointId"
:label="item.balanceSupplierName"
:value="item.meteringPointId"
/>
</el-select>
</el-col>
</el-row>
Interval: {{ timeseries['timeseries'][0]['MyEnergyData_MarketDocument']['period.timeInterval'] }}
<br>
<br>
KWh: {{ timeseries['timeseries'][0]['MyEnergyData_MarketDocument']['TimeSeries'][0]['Period'][0]['Point'][0]['out_Quantity.quantity'] }}
</div>
</template>
