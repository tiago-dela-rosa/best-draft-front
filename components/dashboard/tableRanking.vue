<template>
  <v-simple-table id="tierlistTable">
    <thead>
      <tr>
        <th width="20" class="text-left">Category</th>
        <th class="text-left">God</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.name" :class="row.class">
        <td align="center">{{ row.name }}</td>
        <td>
          <draggable :list="row.data" group="tier">
            <div v-for="data in row.data" :key="data.id" class="god">
              <v-img
                :src="`/gods/icons/${data.slug}.jpg`"
                aspect-ratio="1"
                :title="`${data.name}`"
              >
              </v-img>
            </div>
          </draggable>
        </td>
      </tr>
    </tbody>
  </v-simple-table>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  props: {
    rows: {
      type: Object,
      required: true
    }
  },
  data: () => ({})
}
</script>

<style lang="scss" scoped>
#tierlistTable {
  width: 100%;
  display: table;

  .god {
    width: 50px;
    float: left;
    margin-right: 3px;
    margin-top: 1.5px;
    margin-bottom: 1.5px;
    cursor: pointer;
  }

  td {
    color: #fff;
    padding: 20px;
    border-top: 3px solid #fff;
    border-bottom: 3px solid #fff;
  }

  table tr:hover {
    cursor: pointer;
    filter: contrast(1.5);
  }

  .category-a:hover,
  .category-a {
    background: rgb(255, 70, 45);
    background: linear-gradient(
      90deg,
      rgba(255, 70, 45, 1) 0%,
      rgba(255, 130, 28, 1) 100%
    );
  }
  .category-b:hover,
  .category-b {
    background: rgb(250, 158, 0);
    background: linear-gradient(
      90deg,
      rgba(250, 158, 0, 1) 0%,
      rgba(235, 211, 14, 1) 100%
    );
  }
  .category-c:hover,
  .category-c {
    background: rgb(187, 209, 36);
    background: linear-gradient(
      90deg,
      rgba(187, 209, 36, 1) 0%,
      rgba(53, 222, 134, 1) 100%
    );
  }
  .category-d:hover,
  .category-d {
    background: rgb(17, 201, 238);
    background: linear-gradient(
      90deg,
      rgba(17, 201, 238, 1) 0%,
      rgba(47, 131, 253, 1) 100%
    );
  }
  .category-e:hover,
  .category-e {
    background: rgb(235, 80, 253);
    background: linear-gradient(
      90deg,
      rgba(235, 80, 253, 1) 0%,
      rgba(255, 75, 140, 1) 100%
    );
  }
}
</style>
