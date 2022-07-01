<script>
import Resource from '../resource.js'
import Axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import MoonLoader from 'vue-spinner/src/MoonLoader.vue'

export default {
  components: { MoonLoader },
  
  data () {
    return {
      accessToken: null,
      refreshToken: null,
      meteringPoints: [],
      meteringPointId: null,
      timeseries: null,
      error: null
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

  created () {
    Resource.onChange = function (requests) {
      console.log(new Date(), requests)
    }
  },

  mounted () {
    this.refreshToken = localStorage.getItem('refreshToken')
    if (!this.refreshToken) {
      this.promptRefreshToken()
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
      new Resource('http://localhost:4000/token').get({ token: refreshToken })
        .then((response) => {
          this.accessToken = response.accessToken
        })
    },

    fetchMeteringPoints (accessToken) {
      new Resource('http://localhost:4000/meteringpoints').get({
        token: accessToken,
        includeAll: true
      })
        .then((response) => {
          this.meteringPoints = response.meteringPoints
          this.meteringPointId = ((this.meteringPoints || [])[0] || {}).meteringPointId
        })
    },

    fetchTimeSeries (accessToken) {
      new Resource('http://localhost:4000/gettimeseries')
        .save({}, {
          token: accessToken,
          from: Date.create('2022-04-30').format('%Y-%m-%d'),
          to: Date.create('2022-06-01').format('%Y-%m-%d'),
          aggregation: 'Year',
          meteringPoint: this.meteringPointId
        })
        .then((response) => {
          this.timeseries = response
        })
    }
  }
}
</script>

<template>
  <div>
    <el-row>
      <el-col :offset="6" :span="12">
        <el-select
          v-model="meteringPointId"
          class="m-2"
          placeholder="Vælg måler"
          style="display: block;"
        >
          <el-option
            v-for="item in meteringPoints"
            :key="item.meteringPointId"
            :label="item.balanceSupplierName"
            :value="item.meteringPointId"
          />
        </el-select>
      </el-col>
      <el-col :offset="6" :span="12" v-if="timeseries">
        {{ timeseries['timeseries'][0]['MyEnergyData_MarketDocument']['TimeSeries'][0]['Period'][0]['Point'][0]['out_Quantity.quantity'] }} kWh
      </el-col>
    </el-row>
  </div>
</template>
