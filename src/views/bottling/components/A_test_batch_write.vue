<template>
  <el-dialog v-model="visible" title="植本清方光感修护精华水 120ml FE1802" width="260mm" append-to-body @closed="handleClosed">
    <div>
      <div class="app-container">
        <!-- ===== 第一层：车间 Tabs ===== -->
        <el-tabs v-model="activeWorkshop" type="card" tab-position="top" class="workshop-tabs">
          <!-- 全览标签页 -->
          <el-tab-pane label="全览" name="全部车间">
            <div class="card-scroll-wrapper all-workshop-scroll-wrapper">
              <div class="card-list">
                <FullViewCard
                  v-for="card in getAllWorkshopCards()"
                  :key="card.id"
                  :card="card"
                />
              </div>
            </div>
          </el-tab-pane>

          <!-- 消毒车间 -->
          <el-tab-pane label="消毒车间" name="消毒车间">
            <el-tabs v-model="activeForm" type="" tab-position="left" class="form-tabs">
              <!-- 全部 -->
              <el-tab-pane label="全部" name="全部">
                <div class="card-scroll-wrapper">
                  <div class="card-list">
                    <CardItem
                      v-for="card in getAllCards('消毒车间')"
                      :key="card.id"
                      :card="card"
                      @action="handleAction"
                    />
                  </div>
                </div>
              </el-tab-pane>

              <!-- 领料单 -->
              <el-tab-pane label="领料单" name="领料单">
                <div class="card-scroll-wrapper">
                  <div class="card-list">
                    <CardItem
                      v-for="card in getFormCards('消毒车间', '领料单')"
                      :key="card.id"
                      :card="card"
                      @action="handleAction"
                    />
                    <el-button type="primary" link class="add-page-btn" @click="openAddDialog">加页</el-button>
                  </div>
                </div>
              </el-tab-pane>

              <!-- 处理记录1 -->
              <el-tab-pane label="处理记录1" name="处理记录1">
                <div class="card-scroll-wrapper">
                  <div class="card-list">
                    <CardItem
                      v-for="card in getFormCards('消毒车间', '处理记录1')"
                      :key="card.id"
                      :card="card"
                      @action="handleAction"
                    />
                    <el-button type="primary" link class="add-page-btn" @click="openAddDialog">加页</el-button>
                  </div>
                </div>
              </el-tab-pane>

              <!-- 处理记录2 -->
              <el-tab-pane label="处理记录2" name="处理记录2">
                <div class="card-scroll-wrapper">
                  <div class="card-list">
                    <CardItem
                      v-for="card in getFormCards('消毒车间', '处理记录2')"
                      :key="card.id"
                      :card="card"
                      @action="handleAction"
                    />
                    <el-button type="primary" link class="add-page-btn" @click="openAddDialog">加页</el-button>
                  </div>
                </div>
              </el-tab-pane>

              <!-- 清场记录 -->
              <el-tab-pane label="清场记录" name="清场记录">
                <div class="card-scroll-wrapper">
                  <div class="card-list">
                    <CardItem
                      v-for="card in getFormCards('消毒车间', '清场记录')"
                      :key="card.id"
                      :card="card"
                      @action="handleAction"
                    />
                    <el-button type="primary" link class="add-page-btn" @click="openAddDialog">加页</el-button>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>

          <!-- 灌装车间 -->
          <el-tab-pane label="灌装车间" name="灌装车间">
            <el-tabs v-model="activeForm" type="" tab-position="left" class="form-tabs">
              <el-tab-pane label="全部" name="全部">
                <div class="card-scroll-wrapper">
                  <div class="card-list">
                    <CardItem
                      v-for="card in getAllCards('灌装车间')"
                      :key="card.id"
                      :card="card"
                      @action="handleAction"
                    />
                  </div>
                </div>
              </el-tab-pane>

              <!-- 领料单 -->
              <el-tab-pane label="领料单" name="领料单">
                <div class="card-scroll-wrapper">
                  <div class="card-list">
                    <CardItem
                      v-for="card in getFormCards('灌装车间', '领料单')"
                      :key="card.id"
                      :card="card"
                      @action="handleAction"
                    />
                    <el-button type="primary" link class="add-page-btn" @click="openAddDialog">加页</el-button>
                  </div>
                </div>
              </el-tab-pane>

              <!-- 灌装生产记录1 -->
              <el-tab-pane label="灌装生产记录1" name="灌装生产记录1">
                <div class="card-scroll-wrapper">
                  <div class="card-list">
                    <CardItem
                      v-for="card in getFormCards('灌装车间', '灌装生产记录1')"
                      :key="card.id"
                      :card="card"
                      @action="handleAction"
                    />
                    <el-button type="primary" link class="add-page-btn" @click="openAddDialog">加页</el-button>
                  </div>
                </div>
              </el-tab-pane>

              <!-- 灌装生产记录2 -->
              <el-tab-pane label="灌装生产记录2" name="灌装生产记录2">
                <div class="card-scroll-wrapper">
                  <div class="card-list">
                    <CardItem
                      v-for="card in getFormCards('灌装车间', '灌装生产记录2')"
                      :key="card.id"
                      :card="card"
                      @action="handleAction"
                    />
                    <el-button type="primary" link class="add-page-btn" @click="openAddDialog">加页</el-button>
                  </div>
                </div>
              </el-tab-pane>

              <!-- 清场记录 -->
              <el-tab-pane label="清场记录" name="清场记录">
                <div class="card-scroll-wrapper">
                  <div class="card-list">
                    <CardItem
                      v-for="card in getFormCards('灌装车间', '清场记录')"
                      :key="card.id"
                      :card="card"
                      @action="handleAction"
                    />
                    <el-button type="primary" link class="add-page-btn" @click="openAddDialog">加页</el-button>
                  </div>
                </div>
              </el-tab-pane>

              <!-- 退料单 -->
              <el-tab-pane label="退料单" name="退料单">
                <div class="card-scroll-wrapper">
                  <div class="card-list">
                    <CardItem
                      v-for="card in getFormCards('灌装车间', '退料单')"
                      :key="card.id"
                      :card="card"
                      @action="handleAction"
                    />
                    <el-button type="primary" link class="add-page-btn" @click="openAddDialog">加页</el-button>
                  </div>
                </div>
              </el-tab-pane>

              <!-- 物料平衡表 -->
              <el-tab-pane label="物料平衡表" name="物料平衡表">
                <div class="card-scroll-wrapper">
                  <div class="card-list">
                    <CardItem
                      v-for="card in getFormCards('灌装车间', '物料平衡表')"
                      :key="card.id"
                      :card="card"
                      @action="handleAction"
                    />
                    <el-button type="primary" link class="add-page-btn" @click="openAddDialog">加页</el-button>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>

          <!-- 包装车间 -->
          <el-tab-pane label="包装车间" name="包装车间">
            <el-tabs v-model="activeForm" type="" tab-position="left" class="form-tabs">
              <el-tab-pane label="全部" name="全部">
                <div class="card-scroll-wrapper">
                  <div class="card-list">
                    <CardItem
                      v-for="card in getAllCards('包装车间')"
                      :key="card.id"
                      :card="card"
                      @action="handleAction"
                    />
                  </div>
                </div>
              </el-tab-pane>

              <!-- 领料单 -->
              <el-tab-pane label="领料单" name="领料单">
                <div class="card-scroll-wrapper">
                  <div class="card-list">
                    <CardItem
                      v-for="card in getFormCards('包装车间', '领料单')"
                      :key="card.id"
                      :card="card"
                      @action="handleAction"
                    />
                    <el-button type="primary" link class="add-page-btn" @click="openAddDialog">加页</el-button>
                  </div>
                </div>
              </el-tab-pane>

              <!-- 外包生产记录1 -->
              <el-tab-pane label="外包生产记录1" name="外包生产记录1">
                <div class="card-scroll-wrapper">
                  <div class="card-list">
                    <CardItem
                      v-for="card in getFormCards('包装车间', '外包生产记录1')"
                      :key="card.id"
                      :card="card"
                      @action="handleAction"
                    />
                    <el-button type="primary" link class="add-page-btn" @click="openAddDialog">加页</el-button>
                  </div>
                </div>
              </el-tab-pane>

              <!-- 外包生产记录2 -->
              <el-tab-pane label="外包生产记录2" name="外包生产记录2">
                <div class="card-scroll-wrapper">
                  <div class="card-list">
                    <CardItem
                      v-for="card in getFormCards('包装车间', '外包生产记录2')"
                      :key="card.id"
                      :card="card"
                      @action="handleAction"
                    />
                    <el-button type="primary" link class="add-page-btn" @click="openAddDialog">加页</el-button>
                  </div>
                </div>
              </el-tab-pane>

              <!-- 外包生产记录3 -->
              <el-tab-pane label="外包生产记录3" name="外包生产记录3">
                <div class="card-scroll-wrapper">
                  <div class="card-list">
                    <CardItem
                      v-for="card in getFormCards('包装车间', '外包生产记录3')"
                      :key="card.id"
                      :card="card"
                      @action="handleAction"
                    />
                    <el-button type="primary" link class="add-page-btn" @click="openAddDialog">加页</el-button>
                  </div>
                </div>
              </el-tab-pane>

              <!-- 清场记录 -->
              <el-tab-pane label="清场记录" name="清场记录">
                <div class="card-scroll-wrapper">
                  <div class="card-list">
                    <CardItem
                      v-for="card in getFormCards('包装车间', '清场记录')"
                      :key="card.id"
                      :card="card"
                      @action="handleAction"
                    />
                    <el-button type="primary" link class="add-page-btn" @click="openAddDialog">加页</el-button>
                  </div>
                </div>
              </el-tab-pane>

              <!-- 入库单 -->
              <el-tab-pane label="入库单" name="入库单">
                <div class="card-scroll-wrapper">
                  <div class="card-list">
                    <CardItem
                      v-for="card in getFormCards('包装车间', '入库单')"
                      :key="card.id"
                      :card="card"
                      @action="handleAction"
                    />
                    <el-button type="primary" link class="add-page-btn" @click="openAddDialog">加页</el-button>
                  </div>
                </div>
              </el-tab-pane>

              <!-- 退料单 -->
              <el-tab-pane label="退料单" name="退料单">
                <div class="card-scroll-wrapper">
                  <div class="card-list">
                    <CardItem
                      v-for="card in getFormCards('包装车间', '退料单')"
                      :key="card.id"
                      :card="card"
                      @action="handleAction"
                    />
                    <el-button type="primary" link class="add-page-btn" @click="openAddDialog">加页</el-button>
                  </div>
                </div>
              </el-tab-pane>

              <!-- 物料平衡表 -->
              <el-tab-pane label="物料平衡表" name="物料平衡表">
                <div class="card-scroll-wrapper">
                  <div class="card-list">
                    <CardItem
                      v-for="card in getFormCards('包装车间', '物料平衡表')"
                      :key="card.id"
                      :card="card"
                      @action="handleAction"
                    />
                    <el-button type="primary" link class="add-page-btn" @click="openAddDialog">加页</el-button>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- ===== 操作区域 ===== -->
      <div v-if="operationArea.card" class="operation-area">
        <div class="operation-header">
          <span>{{ operationArea.card.date }}</span>
          <el-button type="primary" link @click="clearOperation">关闭</el-button>
        </div>
        <div class="operation-body">
          <div v-if="operationArea.mode === 'edit'">
            <el-input v-model="editContent" type="textarea" :rows="4" placeholder="请输入内容" />
            <el-button type="primary" @click="submitEdit">提交</el-button>
          </div>
          <div v-else>
            <p>{{ operationArea.card.content }}</p>
            <el-button type="primary" @click="submitReviewOrCheck">
              {{ operationArea.mode === 'review' ? '复核' : '检查' }}
            </el-button>
          </div>
        </div>
      </div>

      <!-- ===== 加页对话框 ===== -->
      <el-dialog v-model="addDialogVisible" title="添加日期" width="400px" append-to-body>
        <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="80px">
          <el-form-item label="日期" prop="date">
            <el-date-picker v-model="addForm.date" type="date" value-format="YYYY-MM-DD" placeholder="请选择日期" style="width: 100%" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddSubmit">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import CardItem from './CardItem.vue';
import FullViewCard from './FullViewCard.vue';

// ===== 状态定义 =====
const activeWorkshop = ref('全部车间');
const activeForm = ref('全部');

// 卡片数据（完整示例，状态值：0=已完成，1=未完成）
const cardsData = reactive({
  '消毒车间': {
    '领料单': [
      { id: 'd1_f1_c1', date: '2026-07-13', content: '领料单内容示例', formName: '领料单', edited: '0', reviewed: '1', checked: '1', archived: '1', editedTime: '2026-07-13 11:20', reviewedTime: null, checkedTime: null, archivedTime: null }
    ],
    '处理记录1': [
      { id: 'd1_f2_c1', date: '2026-07-13', content: '处理记录1内容示例', formName: '处理记录1', edited: '1', reviewed: '0', checked: '1', archived: '1', editedTime: null, reviewedTime: '2026-07-13 14:30', checkedTime: null, archivedTime: null }
    ],
    '处理记录2': [
      { id: 'd1_f3_c1', date: '2026-07-13', content: '处理记录2内容示例', formName: '处理记录2', edited: '0', reviewed: '0', checked: '0', archived: '0', editedTime: '2026-07-13 09:00', reviewedTime: '2026-07-13 10:00', checkedTime: '2026-07-13 11:00', archivedTime: '2026-07-13 12:00' }
    ],
    '清场记录': [
      { id: 'd1_f4_c1', date: '2026-07-13', content: '清场记录内容示例', formName: '清场记录', edited: '1', reviewed: '1', checked: '1', archived: '1', editedTime: null, reviewedTime: null, checkedTime: null, archivedTime: null }
    ]
  },
  '灌装车间': {
    '领料单': [
      { id: 'g1_f1_c1', date: '2026-07-13', content: '领料单内容示例', formName: '领料单', edited: '0', reviewed: '1', checked: '1', archived: '1', editedTime: '2026-07-13 11:20', reviewedTime: null, checkedTime: null, archivedTime: null }
    ],
    '灌装生产记录1': [
      { id: 'g1_f2_c1', date: '2026-07-13', content: '灌装生产记录1内容示例', formName: '灌装生产记录1', edited: '1', reviewed: '1', checked: '0', archived: '1', editedTime: null, reviewedTime: null, checkedTime: '2026-07-13 15:00', archivedTime: null }
    ],
    '灌装生产记录2': [
      { id: 'g1_f3_c1', date: '2026-07-13', content: '灌装生产记录2内容示例', formName: '灌装生产记录2', edited: '0', reviewed: '0', checked: '0', archived: '0', editedTime: '2026-07-13 08:30', reviewedTime: '2026-07-13 09:30', checkedTime: '2026-07-13 10:30', archivedTime: '2026-07-13 11:30' }
    ],
    '清场记录': [
      { id: 'g1_f5_c1', date: '2026-07-13', content: '清场记录内容示例', formName: '清场记录', edited: '1', reviewed: '1', checked: '1', archived: '1', editedTime: null, reviewedTime: null, checkedTime: null, archivedTime: null }
    ],
    '退料单': [
      { id: 'g1_f4_c1', date: '2026-07-13', content: '退料单内容示例', formName: '退料单', edited: '1', reviewed: '0', checked: '1', archived: '1', editedTime: null, reviewedTime: '2026-07-13 16:00', checkedTime: null, archivedTime: null },
      { id: 'g1_f4_c2', date: '2026-07-13', content: '退料单内容示例2', formName: '退料单', edited: '1', reviewed: '1', checked: '1', archived: '1', editedTime: null, reviewedTime: null, checkedTime: null, archivedTime: null }
    ],
    '物料平衡表': [
      { id: 'g1_f6_c1', date: '2026-07-13', content: '物料平衡表内容示例', formName: '物料平衡表', edited: '0', reviewed: '0', checked: '0', archived: '1', editedTime: '2026-07-13 07:00', reviewedTime: '2026-07-13 08:00', checkedTime: '2026-07-13 09:00', archivedTime: null }
    ]
  },
  '包装车间': {
    '领料单': [
      { id: 'b1_f1_c1', date: '2026-07-13', content: '领料单内容示例', formName: '领料单', edited: '0', reviewed: '1', checked: '1', archived: '1', editedTime: '2026-07-13 11:20', reviewedTime: null, checkedTime: null, archivedTime: null },
      { id: 'b1_f1_c2', date: '2026-07-13', content: '领料单内容示例2', formName: '领料单', edited: '1', reviewed: '1', checked: '1', archived: '1', editedTime: null, reviewedTime: null, checkedTime: null, archivedTime: null }
    ],
    '外包生产记录1': [
      { id: 'b1_f2_c1', date: '2026-07-13', content: '外包生产记录1内容示例', formName: '外包生产记录1', edited: '0', reviewed: '0', checked: '1', archived: '1', editedTime: '2026-07-13 10:00', reviewedTime: '2026-07-13 11:00', checkedTime: null, archivedTime: null }
    ],
    '外包生产记录2': [
      { id: 'b1_f3_c1', date: '2026-07-13', content: '外包生产记录2内容示例', formName: '外包生产记录2', edited: '1', reviewed: '1', checked: '1', archived: '1', editedTime: null, reviewedTime: null, checkedTime: null, archivedTime: null }
    ],
    '外包生产记录3': [
      { id: 'b1_f4_c1', date: '2026-07-13', content: '外包生产记录3内容示例', formName: '外包生产记录3', edited: '0', reviewed: '0', checked: '0', archived: '0', editedTime: '2026-07-13 09:00', reviewedTime: '2026-07-13 10:00', checkedTime: '2026-07-13 11:00', archivedTime: '2026-07-13 12:00' }
    ],
    '清场记录': [
      { id: 'b1_f7_c1', date: '2026-07-13', content: '清场记录内容示例', formName: '清场记录', edited: '1', reviewed: '1', checked: '1', archived: '1', editedTime: null, reviewedTime: null, checkedTime: null, archivedTime: null }
    ],
    '入库单': [
      { id: 'b1_f5_c1', date: '2026-07-13', content: '入库单内容示例', formName: '入库单', edited: '0', reviewed: '1', checked: '1', archived: '1', editedTime: '2026-07-13 14:00', reviewedTime: null, checkedTime: null, archivedTime: null }
    ],
    '退料单': [
      { id: 'b1_f6_c1', date: '2026-07-13', content: '退料单内容示例', formName: '退料单', edited: '1', reviewed: '0', checked: '1', archived: '1', editedTime: null, reviewedTime: '2026-07-13 15:00', checkedTime: null, archivedTime: null },
      { id: 'b1_f6_c2', date: '2026-07-14', content: '退料单内容示例2', formName: '退料单', edited: '0', reviewed: '0', checked: '0', archived: '0', editedTime: '2026-07-14 08:00', reviewedTime: '2026-07-14 09:00', checkedTime: '2026-07-14 10:00', archivedTime: '2026-07-14 11:00' }
    ],
    '物料平衡表': [
      { id: 'b1_f8_c1', date: '2026-07-13', content: '物料平衡表内容示例', formName: '物料平衡表', edited: '1', reviewed: '1', checked: '1', archived: '1', editedTime: null, reviewedTime: null, checkedTime: null, archivedTime: null }
    ]
  }
});

// 操作区域状态
const operationArea = ref({
  mode: null,   // 'edit' | 'review' | 'check'
  card: null
});
const editContent = ref('');

// 加页对话框
const addDialogVisible = ref(false);
const addForm = reactive({ date: null });
const addFormRef = ref(null);
const addRules = {
  date: [{ required: true, message: '请选择日期', trigger: 'change' }]
};

// 弹窗可见性
const visible = ref(false);

// ===== 方法 =====
function getFormCards(workshopName, formName) {
  const workshop = cardsData[workshopName];
  if (!workshop) return [];
  return workshop[formName] || [];
}

function getAllCards(workshopName) {
  const workshop = cardsData[workshopName];
  if (!workshop) return [];
  const all = [];
  Object.keys(workshop).forEach(formName => {
    all.push(...workshop[formName]);
  });
  return all;
}

function getAllWorkshopCards() {
  const all = [];
  const workshopNames = Object.keys(cardsData);
  workshopNames.forEach(workshopName => {
    const workshop = cardsData[workshopName];
    Object.keys(workshop).forEach(formName => {
      workshop[formName].forEach(card => {
        all.push({
          ...card,
          workshopName: workshopName
        });
      });
    });
  });
  return all;
}

function getCurrentForm() {
  if (activeForm.value === '全部') return null;
  const workshop = cardsData[activeWorkshop.value];
  if (!workshop) return null;
  return workshop[activeForm.value] || null;
}

function handleAction(mode, card) {
  operationArea.value.mode = mode;
  operationArea.value.card = card;
  if (mode === 'edit') {
    editContent.value = card.content;
  }
}

function clearOperation() {
  operationArea.value.mode = null;
  operationArea.value.card = null;
  editContent.value = '';
}

function submitEdit() {
  ElMessageBox.confirm('确认提交修改？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      alert('提交成功！修改内容：' + editContent.value);
      if (operationArea.value.card) {
        operationArea.value.card.content = editContent.value;
      }
      clearOperation();
    })
    .catch(() => {});
}

function submitReviewOrCheck() {
  const action = operationArea.value.mode === 'review' ? '复核' : '检查';
  ElMessageBox.confirm(`确认${action}通过？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      alert(`${action}成功！`);
      clearOperation();
    })
    .catch(() => {});
}

function openAddDialog() {
  if (activeWorkshop.value === '全部车间') {
    ElMessage.warning('全部车间视图不支持加页，请切换到具体车间');
    return;
  }
  if (activeForm.value === '全部') {
    ElMessage.warning('请先切换到具体表单再添加日期');
    return;
  }
  addForm.date = null;
  addDialogVisible.value = true;
  nextTick(() => {
    if (addFormRef.value) addFormRef.value.resetFields();
  });
}

function handleAddSubmit() {
  const formRef = addFormRef.value;
  if (!formRef) {
    ElMessage.error('表单未加载，请重试');
    return;
  }
  formRef.validate((valid) => {
    if (!valid) return;
    const selectedDate = addForm.date;
    const formCards = getCurrentForm();
    if (!formCards) {
      ElMessage.error('未找到当前表单数据');
      return;
    }
    const exists = formCards.some((c) => c.date === selectedDate);
    if (exists) {
      ElMessage.warning('该日期已存在，请选择其他日期');
      return;
    }
    const newCard = {
      id: `card_${Date.now()}`,
      date: selectedDate,
      content: '待填写',
      formName: activeForm.value,
      edited: '1',
      reviewed: '1',
      checked: '1',
      archived: '1',
      editedTime: null,
      reviewedTime: null,
      checkedTime: null,
      archivedTime: null
    };
    formCards.push(newCard);
    nextTick(() => scrollToNewCard());
    addDialogVisible.value = false;
    ElMessage.success('添加成功');
  });
}

function scrollToNewCard() {
  const wrapper = document.querySelector('.card-scroll-wrapper');
  if (wrapper) {
    wrapper.scrollTop = wrapper.scrollHeight;
  }
}

function open(data) {
  visible.value = true;
  // 处理传入数据
}

function close() {
  visible.value = false;
}

function handleClosed() {
  // 清理操作
}

// 暴露方法
defineExpose({ open, close });
</script>

<style scoped>
/* ===== 布局容器 ===== */
.app-container {
  padding: 0;
}
.app-container,
.workshop-tabs,
.workshop-tabs .el-tabs__content,
.workshop-tabs .el-tab-pane,
.form-tabs,
.form-tabs .el-tabs__content,
.form-tabs .el-tab-pane {
  width: 100% !important;
  overflow: hidden !important;
  max-width: 100% !important;
}

/* ===== 滚动容器 ===== */
.card-scroll-wrapper {
  height: 585px;
  width: 100% !important;
  max-width: 100% !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  padding: 8px 0;
}

/* 全览页面专用滚动容器（高度适配小卡片） */
.all-workshop-scroll-wrapper {
  height: 538px;
}

/* ===== 卡片列表（flex 换行布局） ===== */
.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
  padding: 4px 0;
  align-content: flex-start;
}

/* ===== 加页按钮 ===== */
.add-page-btn {
  flex: 0 0 188px;
  height: 175px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: #409eff;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  background: #fafafa;
  transition: all 0.2s;
}
.add-page-btn:hover {
  background: #ecf5ff;
  border-color: #409eff;
}

/* ===== 操作区域 ===== */
.operation-area {
  height: 300px;
  margin-top: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 16px;
  overflow: auto;
}
.operation-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
  margin-bottom: 12px;
  font-weight: bold;
}
.operation-body {
  padding: 8px 0;
}
.operation-body .el-textarea {
  margin-bottom: 12px;
}
</style>



