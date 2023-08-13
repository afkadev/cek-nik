<script setup>
import 'element-plus/theme-chalk/dark/css-vars.css'
import { useDark } from '@vueuse/core'

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
})

const value = ref('')
const inputnik = ref('')
const loading = ref(false)
const loading_dpt = ref(false)
const typeCheck = ref('nik')
const result = ref(null);
const resultExist = ref(false)
const hasChecked = ref(false)
const result_dpt = ref(null);
const resultExist_dpt = ref(false)
const hasChecked_dpt = ref(false)

const setTypeCheck = (type) => {
  typeCheck.value = type
}

const cekNik = async () => {
  loading.value = true
  hasChecked.value = false
  resultExist.value = false;
  const { data: nikdata } = await useFetch(
    'https://api.unpai.red/api-nik.php?nik=' + inputnik.value + '&wid=' + value.value,
    { lazy: true }
  )
  result.value = nikdata._rawValue
  if (nikdata._rawValue.error) {
    resultExist.value = false;
  } else {
    resultExist.value = true;
  }

  hasChecked.value = true

  setTimeout(() => {
    hasChecked.value = false
  }, 3000)

  loading.value = false
}

const setGender = (type) => {
  if (type === 'L') {
    return 'Laki-laki'
  } else {
    return 'Perempuan'
  }
}
const cekDPT = async () => {
  loading_dpt.value = true
  hasChecked_dpt.value = false
  resultExist_dpt.value = false;
  const { data: nikdata } = await useFetch(
    'https://api.unpai.red/api-dpt.php?nik=' + inputnik.value,
    { lazy: true }
  )
  result_dpt.value = nikdata._rawValue.data.findNikSidalih
  if (nikdata._rawValue.errors) {
    resultExist_dpt.value = false;
  } else {
    resultExist_dpt.value = true;
  }
  hasChecked_dpt.value = true

  setTimeout(() => {
    hasChecked_dpt.value = false
  }, 3000)

  loading_dpt.value = false
}
</script>
<template>
  <div class="main-content mx-auto">
      <el-row :gutter="20" class="mx-2">
        <el-col :span="24" class="px-0 text-center">
          <h2 class="my-2">
            <el-icon color="#409EFC" class="me-2" style="font-size:28px;vertical-align: middle;"><el-icon-element-plus /></el-icon> 
            <el-text type="primary" style="font-size:28px;vertical-align: middle;">ngCHECK</el-text>
          </h2>
          <span><em>Cek NIK & DPT Online</em></span>
          <el-divider border-style="dashed" />
        </el-col>
      </el-row>
    
    <el-switch class="pojok" v-model="isDark" :active-action-icon="ElIconMoon" :inactive-action-icon="ElIconSunny" />
    <el-row :gutter="20" class="mx-2">
      <el-col :span="24" class="px-0">
        <div class="flex gx-2 mb-3  pt-2">
          <el-button class="float-start mb-3" @click="setTypeCheck('nik')"
            :type="typeCheck === 'nik' ? 'primary' : 'info'" style="width:48%">CEK
            NIK</el-button>
          <el-button class="float-end  mb-3" @click="setTypeCheck('dpt')" :type="typeCheck === 'dpt' ? 'primary' : 'info'"
            style="width:48%">CEK
            DPT</el-button>
        </div>

        <div v-if="typeCheck === 'nik'">
          <el-select style="width: 100%" v-model="value" filterable placeholder="PILIH KOTA">
            <el-option v-for="item in ListWilayah" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-input v-show="value !== ''" v-model="inputnik" class="w-100 mt-3" placeholder="MASUKAN NIK"
            :suffix-icon="ElIconSearch" />

          <div v-show="loading === true" class="my-3">
            <el-progress :percentage="100" :text-inside="true" :indeterminate="true" />
          </div>
          <div class="text-center my-3" v-if="value !== '' && inputnik.length >= 16">
            <el-button @click="cekNik()" type="primary" size="large" class="w-100">CEK NIK</el-button>
          </div>
          <div v-if="resultExist && inputnik.length >= 16">
            <div class="mt-2">
              <el-alert class="my-3" title="Data ditemukan" type="success" show-icon :closable="false" />
              <el-descriptions direction="vertical" :column="3" size="default" border>
                <el-descriptions-item align="center" label="Nama Disamarkan" :span="3">{{ result.nama
                }}</el-descriptions-item>
                <el-descriptions-item label="Provinsi">{{ result.nama_provinsi }}</el-descriptions-item>
                <el-descriptions-item label="Kabupaten">{{ result.nama_kabupaten }}</el-descriptions-item>
                <el-descriptions-item label="Kecamatan">{{ result.nama_kecamatan }}</el-descriptions-item>
                <el-descriptions-item label="Kelurahan">{{ result.nama_kelurahan }}</el-descriptions-item>
                <el-descriptions-item label="Tempat Lahir">{{ result.tempat_lahir }}</el-descriptions-item>
                <el-descriptions-item label="Tanggal Lahir">{{ result.tanggal_lahir }}</el-descriptions-item>
                <el-descriptions-item label="Jenis Kelamin">{{ setGender(result.jenis_kelamin) }}</el-descriptions-item>
                <el-descriptions-item label="TPS">{{ result.tps }}</el-descriptions-item>
                <el-descriptions-item label="Status">
                  <el-tag size="default" type="success">
                    {{ result.status.toUpperCase() }}
                  </el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
          <div v-if="hasChecked && !resultExist && inputnik.length >= 16">
            <el-alert class="my-3" title="Data anda keliru/tidak terdaftar!" type="error" show-icon :closable="false" />
          </div>
        </div>

        <div v-if="typeCheck === 'dpt'">
          <el-input v-model="inputnik" class="w-100" placeholder="MASUKAN NIK" :suffix-icon="ElIconSearch" />
          <div v-show="loading_dpt === true" class="my-3">
            <el-progress :percentage="100" :text-inside="true" :indeterminate="true" />
          </div>
          <div class="text-center my-3" v-if="inputnik.length >= 16">
            <el-button @click="cekDPT()" type="primary" size="large" class="w-100">CEK DPT</el-button>
          </div>
          <div v-if="resultExist_dpt && inputnik.length >= 16">
            <div class="mt-2">
              <el-alert class="my-3" title="Data ditemukan" type="success" show-icon :closable="false" />
              <el-descriptions direction="vertical" :column="3" size="default" border>
                <el-descriptions-item align="center" label="Nama pemilih" :span="3">{{ result_dpt.nama
                }}</el-descriptions-item>
                <el-descriptions-item label="NIK">{{ result_dpt.nik.replace('**********', '***') }}</el-descriptions-item>
                <el-descriptions-item label="NKK">{{ result_dpt.nkk.replace('**********', '***') }}</el-descriptions-item>
                <el-descriptions-item label="Kabupaten">{{ result_dpt.kabupaten }}</el-descriptions-item>
                <el-descriptions-item label="Kecamatan">{{ result_dpt.kecamatan }}</el-descriptions-item>
                <el-descriptions-item label="Kelurahan">{{ result_dpt.kelurahan }}</el-descriptions-item>
                <el-descriptions-item label="TPS">{{ result_dpt.tps }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
          <div v-if="hasChecked_dpt && !resultExist_dpt && inputnik.length >= 16">
            <el-alert class="my-3" title="Data anda keliru/tidak terdaftar!" type="error" show-icon :closable="false" />
          </div>
        </div>


      </el-col>
    </el-row>
  </div>
</template>

<style>
.main-content {
  max-width: 400px;
  margin: 0 auto;
  padding-bottom: 60px;
}

.pesanerror {
  width: 400px !important;
}

.pojok {
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 999;
}
</style>