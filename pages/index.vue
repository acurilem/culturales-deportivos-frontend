<template>
    <UMAGBreadCrumb module-name="Créditos Culturales y Deportivos" />
    <hr>
    <div class="d-flex justify-content-end">
        <a href="/culturales-deportivos/manual-culturales_deportivos-estudiante.pdf" download="manual-culturales_deportivos-estudiante.pdf" class="btn btn-light align-items-center">
            <span class="title bold">Manual de usuario </span>
            <i class="fa fa-file-lines fa-lg lg-2"></i>
        </a>
    </div>
    <h3>Créditos Culturales y Deportivos</h3>
    <div>
      <div>
        <div class="mb-2">
        <div><h4 style="display: inline;">Semestre {{semestre}} del {{ano}}</h4>
          <a data-bs-toggle="collapse" href="#collapse" role="button" aria-expanded="false" style="margin-left: 3px;">(Cambiar)
          </a></div>
          <div class="collapse" id="collapse">
            <div class="card card-body">
              <div>
                  <b>Seleccione año:</b>
                  <select ref="anoSelect" class="form-select" aria-label="Seleccione año">
                    <option v-for="a in anos" :key="a" :value="a">{{ a }}</option>
                  </select>                     
                  <b>Seleccione semestre:</b>
                  <select ref="semSelect" class="form-select" aria-label="Seleccione semestre">
                    <option value="1">1</option>
                    <option selected value="2">2</option>
                  </select>
                  
                <div class="mt-3">
                  <button @click="cambiarSemestre"
                  type="button" class="btn btn-primary" data-bs-target="#collapse" data-bs-toggle="collapse" aria-expanded="false">
                    Consultar</button>
                </div>
              </div>
            </div>
          </div>
          <hr>
          <!-- Botones seleccionar Culturales / Deportivos -->
          <button type="button"
                  class="btn btn-outline-primary"
                  :class="{ active: activeButton === 'culturales' }"
                  @click="cambiarCredito('culturales')"
                  style="margin-right: 5px;">
                    <i class="fa-solid fa-book-open-reader fa-xl"></i><b> Culturales</b>
          </button>
          <button type="button"
                  class="btn btn-outline-primary"
                  :class="{ active: activeButton === 'deportivos' }"
                  @click="cambiarCredito('deportivos')">
                  <i class="fa-solid fa-volleyball fa-xl"></i><b> Deportivos</b>
          </button>
        </div>
      </div>
      <!-- Botones seleccionar Listado / Horario -->
      <div>
        <ul class="nav nav-tabs" id="tabEleccion">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#listado_div">Listado</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" aria-current="page" href="#" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#horario_div">Horario</a>
          </li>
        </ul>
      </div>

      <!-- Loading Spinner -->
      <div class="m-4 d-flex align-items-center" v-if="loading">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <div class="ms-2">Cargando créditos...</div>
      </div>
      <div v-if="!loading" class="tab-content mt-2 fade-in">
        <!-- Tabla Listado -->
        <div class="table-container" :class="['tab-pane', 'fade', 'show active']" :id="'listado_div'" :key="'listado_div'">
            <table class="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Nro</th>
                  <th>Nombre curso</th>
                  <th>Profesor(a)</th>
                  <th>Grupo</th>
                  <th>Descripción</th>
                  <th>Inscritos</th>
                  <th>Vacantes</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in sortedCreditos" :key="index">
                  <td>{{ index + 1 || 'No disponible' }}</td>
                  <td><b>{{ item.NombreComun || 'No disponible' }}</b></td>
                  <td>{{ item.NombreCompleto || 'No disponible' }}</td>
                  <td><center>{{ item.NumeroGrupos || 'No disponible' }}</center></td>
                  <td>
                    <template v-for="(horario, hIndex) in item.horarios" :key="hIndex">
                      <b>HORARIO:</b> {{ horario.Dia }} {{ horario.HoraInicio }} a {{ horario.HoraFin }}, {{ horario.NomSala }} <br>
                    </template>
                  </td>
                  <td data-bs-toggle="modal" data-bs-target="#listadoAlumnosModal" @click="getListadoAlumnos(item)"><a href=# role="button"><center>{{ item.Inscritos || 0 }}</center></a></td>
                  <td><center>{{ item.CantidadEstimadaAlumnos - item.Inscritos }}</center></td>
                </tr>
                <tr><td colspan="5" class="text-end"><b>Totales : </b></td><td class="text-center">{{ inscritosTotales }}</td><td class="text-center">{{ vacantesTotales }}</td></tr>
              </tbody>
            </table>
          </div>
        <!-- Tabla Horario  -->
        <div class='table-container' :class="['tab-pane', 'fade']" :id="'horario_div'" :key="'horario_div'">
          <div class="alert alert-primary" role="alert" >
            <center><i class="fa-solid fa-circle-info"></i> Los horarios están en construcción y sujetos a cambios</center>
          </div>
            <table class="table table-bordered cell-hover">
              <thead>
                <tr>
                  <th style="min-width: 100px;">Horario</th>
                  <th style="text-align: center;" v-for="day in days" :key="day.id">{{ day.NombreDia }}</th>
                </tr>
              </thead>
              <tbody>
                  <!-- Recorre los horarios -->
                  <tr v-for="(horario, index) in timeSlots" :key="index">
                    <td>{{ horario.HoraIni+' - '+horario.HoraFin }}</td>
                    <!-- Genera la información específica para cada día y bloque -->
                    <template v-for="day in days" :key="day.id">
                      <td style="text-align: center;">
                        <div v-html="getInformacionPorDia(day,horario.HoraIni,horario.HoraFin)"></div>
                      </td>
                    </template>
                  </tr>

                </tbody>
            </table>
        </div>
      </div>
      <!-- Alerta: Consultas e informaciones Culturales / Deportivos  -->
      <!-- Alerta Culturales  -->
      <div v-if="deportivoCultural == 215 && loading == false" class="alert alert-primary" role="alert">
            <center>Consultas e informaciones créditos culturales <br> <i class="fa-solid fa-phone"></i> 207 178 (Horario: 10-12hrs, 15-18hrs)</center>
      </div>
      <!-- Alerta Deportivos  -->
      <div v-if="deportivoCultural == 579 && loading == false" class="alert alert-primary" role="alert">
            <center>Consultas e informaciones créditos deportivos<br> <i class="fa-solid fa-phone"></i> 207 323 (Horario: 10-12hrs, 15-18hrs)</center>
      </div>

      <!-- Listado Alumnos Modal -->
      <div id="listadoAlumnosModal" class="modal fade centering">
        <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Listado de inscritos</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div v-if="listadoAlumnos === null && !loadingListado">
                <h5>{{ creditoSeleccionado.NombreComun }} - Grupo {{ creditoSeleccionado.NumeroGrupos }}<hr></h5>
                <div class="alert alert-primary" role="alert">
                  <i class="fa-solid fa-circle-info"></i> No hay estudiantes inscritos
                </div>
              </div>
              <div v-else>
                <div class="m-4 d-flex align-items-center justify-content-center" v-if="loadingListado">
                  <div class="spinner-border text-primary" role="status">
                </div>
              </div>
                <div v-else>
                  <h5>{{ creditoSeleccionado.NombreComun }} - Grupo {{ creditoSeleccionado.NumeroGrupos }} <hr></h5>
                  <table class="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Nro</th>
                        <th>Apellidos</th>
                        <th>Nombres</th>
                        <th>Carrera</th>
                        <th>Especialidad</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in listadoAlumnos" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.Apellidos || 'No disponible' }}</td>
                        <td>{{ item.Nombre || 'No disponible' }}</td>
                        <td>{{ item.NombreCarrera || 'No disponible' }}</td>
                        <td>{{ item.NombreEspecialidad || 'No disponible' }}</td>
                        <td>{{ item.NombreEstadoInscripcion || 'No disponible' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div> 
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  import { UserTypes } from '@/models/user/user.model.ts'
  definePageMeta({
      middleware: 'roles',
      roles: [
          UserTypes.ALUMNOS
      ],

  });
  
  import axios from 'axios';
  export default {
    data() {
      return {
        loading: false, // Agrega una variable para controlar el estado de carga
        activeButton: 'culturales',
        ano: "",
        anos:[],
        inscritosTotales:0,
        vacantesTotales:0,
        semestre: "",
        creditos: [],
        deportivoCultural: 215, // Inicialmente se muestran culturales
        days: [
          { IdDia: 1, NombreDia: "LUNES" },
          { IdDia: 2, NombreDia: "MARTES" },
          { IdDia: 3, NombreDia: "MIERCOLES" },
          { IdDia: 4, NombreDia: "JUEVES" },
          { IdDia: 5, NombreDia: "VIERNES" },
          { IdDia: 6, NombreDia: "SABADO" },
        ],
        timeSlots: [],
        horarios: [],

        creditoSeleccionado: "",
        nombreCreditoSeleccionado: "",
        listadoAlumnos: [],
        loadingListado: true,

        // Ordenar tablas:
        sortKey: 'NombreComun', // Columna por la que se ordena inicialmente
        sortOrders: {
          NombreComun: 1,
          NombreCompleto: 1,
          NumeroGrupos: 1,
          Inscritos: 1,
        },
      };
    },

    mounted() {
      //this.fetchTimeSlots(); // Llama a la función fetchTimeSlots en el momento en que se carga el componente

    },

    created() {
      this.loadData();

    },

    props: {
      horarios: {
        type: Array,
        required: true
      }
    },

    computed: {
      inscritosTotales() {
        return this.sortedCreditos.reduce((total, item) => total + (item.Inscritos || 0), 0);
      },
      vacantesTotales() {
        return this.sortedCreditos.reduce((total, item) => total + ((item.CantidadEstimadaAlumnos || 0) - (item.Inscritos || 0)), 0);
      },
      filteredTimeSlots() {
        return this.timeSlots.filter((slot, index, arr) => {
          if (index === 0) return true;
          return slot.IdBloque !== arr[index - 1].IdBloque;
        });
      },
      sortedCreditos() {
        return this.creditos.slice().sort((a, b) => {
          const key = this.sortKey;
          const order = this.sortOrders[key] || 1;
          if (key === 'NombreComun' || key === 'NombreCompleto') {
            // Ordena alfabéticamente
            return order * (a[key].localeCompare(b[key]));
          } else {
            // Ordena numéricamente
            return order * (a[key] - b[key]);
          }
        });
        },
      },

    methods:{
      sortBy(key) {
        this.sortKey = key;
        this.sortOrders[key] = this.sortOrders[key] * -1;
      },

      async loadData(){
        await this.getAnoProceso(); // Obtiene el semestre actual (mediante la tabla ano_proceso)
        this.fetchData(); // Llama a fetchData después de getAnoProceso
        this.fetchTimeSlots(); // También llama a fetchTimeSlots si es necesario después de getAnoProceso
      },

      // Obtiene la información de los créditos
      async fetchData() {
        this.loading = true; // Muestra el spinner de carga al comenzar la solicitud
        try {
          const response = await this.$axiosService.get(this.$config.public.backBaseUrl + '/cultural-deportivo/' + this.deportivoCultural+'/'+this.semestre+'/'+this.ano);
          this.creditos = response.data; // Asumiendo que el objeto de datos está en la propiedad 'data'
        } catch (error) {
          console.error('Error al obtener la información.', error);
        } finally {
          this.loading = false; // Oculta el spinner de carga una vez que la solicitud se completa (con o sin error)
        }
      },

      // Obtiene los bloques de horario
      async fetchTimeSlots() {
        try {
          const response = await this.$axiosService.get(this.$config.public.backBaseUrl + '/cultural-deportivo/dias/'+this.semestre+'/'+this.ano);
          const uniqueTimeSlots = new Set();
          response.data.forEach((element) => {
            const horario = element.HoraIni + "-" + element.HoraFin+"-"+element.IdBloque;
            uniqueTimeSlots.add(horario);
          });
          this.timeSlots = Array.from(uniqueTimeSlots); // Actualiza los timeSlots sin valores repetidos
          //Separa los horarios por guion y pone llave valor y los guarda en timeSlots
          this.timeSlots = this.timeSlots.map((element) => {
            const horario = element.split("-");
            return {
              HoraIni: horario[0],
              HoraFin: horario[1],
              IdBloque: horario[2],
            };
          });
          } catch (error) {
            console.error("Error al obtener los datos de la API:", error);
        }
      },

      getClaseByDia(dia) {
        var horario = "";
        // Por cada dato en creditos se obtiene el horario si es igual al dia
        this.creditos.forEach(element => {
          // Verificar si el elemento tiene una propiedad 'horarios'
          if (element.horarios) {
            // Buscar en cada horario para encontrar el 'dia' coincidente
            element.horarios.forEach(horarioElement => {
              if (horarioElement.Dia.trim() === dia.trim()) {
                horario = horarioElement;
              }
            });
          }
        });
      },

      // Cambia el semestre (1 a 2) o viceversa
      cambiarSemestre(){
        // Resetear botones del nav-tab (se buguea si no se resetea)
        const activeTab = document.querySelector('.nav-link.active');
        if (activeTab) {
          activeTab.classList.remove('active');
        }
        const listadoTab = document.querySelector('[data-bs-target="#listado_div"]');
        if (listadoTab) {
          listadoTab.classList.add('active');
        }

        this.ano = this.$refs.anoSelect.value;
        this.semestre = this.$refs.semSelect.value;
        this.fetchData();
        this.fetchTimeSlots();
      },

      // Obtiene el año y semestre que se está cursando, además de los años desde 2011 hasta el año actual
      async getAnoProceso(){
        try {
          const response = await this.$axiosService.get(this.$config.public.backBaseUrl + '/cultural-deportivo/ano_proceso');
          this.ano = response.data.AnoProceso.trim();
          for (let i = 2011; i <= this.ano; i++) {
            this.anos.push(i);
          }
          this.semestre = response.data.SemProceso.trim();
        } catch (error) {
          console.error('Error al obtener la información.', error);
        }
      },

      // Genera la información de la tabla "Horario" (las clases de cada bloque, los horarios, etc)
      getInformacionPorDia(day, horaIni, horaFin) {
            let specificInfo = "";

            for (var i = 0; i < this.creditos.length; i++) {
              if (this.creditos[i].horarios) {
                for (var j = 0; j < this.creditos[i].horarios.length; j++) {
                  if (
                    this.creditos[i].horarios[j].HoraInicio == horaIni &&
                    this.creditos[i].horarios[j].Dia.trim() == day.NombreDia.trim()
                  ) {
                    if (specificInfo) {
                      specificInfo += "<br>" + this.creditos[i].NombreComun + "<sup> (Grupo " +this.creditos[i].NumeroGrupos + ")</sup> - "+ this.creditos[i].NombreTipoSeccion +"<br>(" + this.creditos[i].NombreCompleto + ")<br><b>" + this.creditos[i].horarios[j].NomSala + "</b>";
                    } else {
                      specificInfo = this.creditos[i].NombreComun + "<sup> (Grupo " +this.creditos[i].NumeroGrupos + ")</sup> - "+ this.creditos[i].NombreTipoSeccion +"<br>(" + this.creditos[i].NombreCompleto + ")<br><b>" + this.creditos[i].horarios[j].NomSala + "</b>";
                    }
                  }
                }
              }
            }
            if (specificInfo) {
              return specificInfo;
            } else {
              return "";
            }
          },

      // Cambia la selección de crédito Cultural a Deportivo (o viceversa)
      cambiarCredito(buttonId){
        this.activeButton = buttonId;
        // Resetear botones del nav-tab (se buguea si no se resetea)
        const activeTab = document.querySelector('.nav-link.active');
        if (activeTab) {
          activeTab.classList.remove('active');
        }
        const listadoTab = document.querySelector('[data-bs-target="#listado_div"]');
        if (listadoTab) {
          listadoTab.classList.add('active');
        }

        if(buttonId == 'culturales'){
          this.deportivoCultural = 215;
        }else{
          this.deportivoCultural = 579;
        }
        this.fetchData();
        this.fetchTimeSlots();
      },

      //Mostrar el Modal del Listado de Alumnos
      async getListadoAlumnos(item){
        this.loadingListado = true;
        try {
          const response = await this.$axiosService.get(this.$config.public.backBaseUrl + '/cultural-deportivo/listado_alumnos/' + item.ID);
          this.loadingListado = false;
          this.listadoAlumnos = response.data;
          this.creditoSeleccionado = item;
        } catch (error) {
          console.error('Error al obtener la información.', error);
        }
      }
    },
  };
</script>

<style>
  .table-container {
    max-width: 100%;
    overflow-x: auto;
  }
  .form-select{
    max-width: 150px;
    min-width: 100px;
  }
  .btn-outline-primary{
    --bs-btn-active-color: #fff;

    --bs-btn-hover-color: #fff; 
  }
  .schedule {
    font-family: Arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }
  .schedule td,
  .schedule th {
    border: 1px solid #ddd;
    padding: 8px;
  }
  .schedule th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #f2f2f2;
  }
  .highlight {
    background-color: lightblue;
  }
  .cell-hover td:hover{
    
    background-color: rgba(var(--bs-emphasis-color-rgb), 0.075); 
  
  }

  /*
  .btn-outline-primary{
    color:#593d80;
    border-color: #593d80;
  }

  .btn-outline-primary{
    --bs-btn-active-color: #fff;
    --bs-btn-active-bg: #593d80;
    --bs-btn-active-border-color: #593d80;
    --bs-btn-hover-color: #fff;
    --bs-btn-hover-bg: #593d80;
    --bs-btn-hover-border-color: #593d80;
  }

  .table-bordered{
    border: 2px solid #593d808c;
  }

  .purple-cell{
    background-color: #593d80d7 !important;
    color: white !important;
  }

  .spinner-border{
    color: #593d80d7;
  }
  */
</style>