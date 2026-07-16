<template>
  <div>
    <h3 style="text-align: center">植本清方光感修护精华水 120ml FE1802</h3>

    <div class="app-container">
      <!-- ===== 第一层：车间 Tabs（硬编码三个车间） ===== -->
      <el-tabs v-model="activeWorkshop" type="card" tab-position="top" class="workshop-tabs">
        <!-- 消毒车间 -->
        <el-tab-pane label="消毒车间" name="消毒车间">
          <!-- ===== 第二层：表单 Tabs ===== -->
          <el-tabs v-model="activeForm" type="" tab-position="left" class="form-tabs">
            <!-- “全部”标签页 -->
            <el-tab-pane label="全部" name="全部">
              <div class="card-scroll-wrapper">
                <div class="card-list">
                  <el-card
                    v-for="card in getAllCards('消毒车间')"
                    :key="card.id"
                    class="placeholder-card"
                    shadow="hover"
                  >
                    <template #header>
                      <span style="text-align: center;">{{ card.formName }}</span>
                    </template>
                    <div>{{ card.content }}</div>
                    <div class="card-actions">
                      <el-button type="text" @click="handleAction('edit', card)">编辑</el-button>
                      <el-button type="text" @click="handleAction('review', card)">复核</el-button>
                      <el-button type="text" @click="handleAction('check', card)">检查</el-button>
                    </div>
                    <template #footer>
                      <span>{{ card.date }}</span>
                      <span style="margin-left: 10px;">已归档</span>
                    </template>
                  </el-card>
                </div>
              </div>
            </el-tab-pane>

            <!-- 领料单 -->
            <el-tab-pane label="领料单" name="领料单">
              <div class="card-scroll-wrapper">
                <div class="card-list">
                  <el-card
                    v-for="card in getFormCards('消毒车间', '领料单')"
                    :key="card.id"
                    class="placeholder-card"
                    shadow="hover"
                  >
                    <template #header>
                      <span style="text-align: center;">{{ card.formName }}</span>
                    </template>
                    <div>{{ card.content }}</div>
                    <div class="card-actions">
                      <el-button type="text" @click="handleAction('edit', card)">编辑</el-button>
                      <el-button type="text" @click="handleAction('review', card)">复核</el-button>
                      <el-button type="text" @click="handleAction('check', card)">检查</el-button>
                    </div>
                    <template #footer>
                      <span>{{ card.date }}</span>
                      <span style="margin-left: 10px;"></span>
                    </template>
                  </el-card>
                  <el-button type="text" class="add-page-btn" @click="openAddDialog">加页</el-button>
                </div>
              </div>
            </el-tab-pane>

            <!-- 处理记录1 -->
            <el-tab-pane label="处理记录1" name="处理记录1">
              <div class="card-scroll-wrapper">
                <div class="card-list">
                  <el-card
                    v-for="card in getFormCards('消毒车间', '处理记录1')"
                    :key="card.id"
                    class="placeholder-card"
                    shadow="hover"
                  >
                    <template #header>
                      <span style="text-align: center;">{{ card.formName }}</span>
                    </template>
                    <div>{{ card.content }}</div>
                    <div class="card-actions">
                      <el-button type="text" @click="handleAction('edit', card)">编辑</el-button>
                      <el-button type="text" @click="handleAction('review', card)">复核</el-button>
                      <el-button type="text" @click="handleAction('check', card)">检查</el-button>
                    </div>
                    <template #footer>
                      <span>{{ card.date }}</span>
                      <span style="margin-left: 10px;"></span>
                    </template>
                  </el-card>
                  <el-button type="text" class="add-page-btn" @click="openAddDialog">加页</el-button>
                </div>
              </div>
            </el-tab-pane>

            <!-- 处理记录2 -->
            <el-tab-pane label="处理记录2" name="处理记录2">
              <div class="card-scroll-wrapper">
                <div class="card-list">
                  <el-card
                    v-for="card in getFormCards('消毒车间', '处理记录2')"
                    :key="card.id"
                    class="placeholder-card"
                    shadow="hover"
                  >
                    <template #header>
                      <span style="text-align: center;">{{ card.formName }}</span>
                    </template>
                    <div>{{ card.content }}</div>
                    <div class="card-actions">
                      <el-button type="text" @click="handleAction('edit', card)">编辑</el-button>
                      <el-button type="text" @click="handleAction('review', card)">复核</el-button>
                      <el-button type="text" @click="handleAction('check', card)">检查</el-button>
                    </div>
                    <template #footer>
                      <span>{{ card.date }}</span>
                      <span style="margin-left: 10px;"></span>
                    </template>
                  </el-card>
                  <el-button type="text" class="add-page-btn" @click="openAddDialog">加页</el-button>
                </div>
              </div>
            </el-tab-pane>

            <!-- 清场记录 -->
            <el-tab-pane label="清场记录" name="清场记录">
              <div class="card-scroll-wrapper">
                <div class="card-list">
                  <el-card
                    v-for="card in getFormCards('消毒车间', '清场记录')"
                    :key="card.id"
                    class="placeholder-card"
                    shadow="hover"
                  >
                    <template #header>
                      <span style="text-align: center;">{{ card.formName }}</span>
                    </template>
                    <div>{{ card.content }}</div>
                    <div class="card-actions">
                      <el-button type="text" @click="handleAction('edit', card)">编辑</el-button>
                      <el-button type="text" @click="handleAction('review', card)">复核</el-button>
                      <el-button type="text" @click="handleAction('check', card)">检查</el-button>
                    </div>
                    <template #footer>
                      <span>{{ card.date }}</span>
                      <span style="margin-left: 10px;"></span>
                    </template>
                  </el-card>
                  <el-button type="text" class="add-page-btn" @click="openAddDialog">加页</el-button>
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
                  <el-card
                    v-for="card in getAllCards('灌装车间')"
                    :key="card.id"
                    class="placeholder-card"
                    shadow="hover"
                  >
                    <template #header>
                      <span style="text-align: center;">{{ card.formName }}</span>
                    </template>
                    <div>{{ card.content }}</div>
                    <div class="card-actions">
                      <el-button type="text" @click="handleAction('edit', card)">编辑</el-button>
                      <el-button type="text" @click="handleAction('review', card)">复核</el-button>
                      <el-button type="text" @click="handleAction('check', card)">检查</el-button>
                    </div>
                    <template #footer>
                      <span>{{ card.date }}</span>
                      <span style="margin-left: 10px;">已归档</span>
                    </template>
                  </el-card>
                </div>
              </div>
            </el-tab-pane>

            <!-- 领料单 -->
            <el-tab-pane label="领料单" name="领料单">
              <div class="card-scroll-wrapper">
                <div class="card-list">
                  <el-card
                    v-for="card in getFormCards('灌装车间', '领料单')"
                    :key="card.id"
                    class="placeholder-card"
                    shadow="hover"
                  >
                    <template #header>
                      <span style="text-align: center;">{{ card.formName }}</span>
                    </template>
                    <div>{{ card.content }}</div>
                    <div class="card-actions">
                      <el-button type="text" @click="handleAction('edit', card)">编辑</el-button>
                      <el-button type="text" @click="handleAction('review', card)">复核</el-button>
                      <el-button type="text" @click="handleAction('check', card)">检查</el-button>
                    </div>
                    <template #footer>
                      <span>{{ card.date }}</span>
                      <span style="margin-left: 10px;"></span>
                    </template>
                  </el-card>
                  <el-button type="text" class="add-page-btn" @click="openAddDialog">加页</el-button>
                </div>
              </div>
            </el-tab-pane>

            <!-- 灌装生产记录1 -->
            <el-tab-pane label="灌装生产记录1" name="灌装生产记录1">
              <div class="card-scroll-wrapper">
                <div class="card-list">
                  <el-card
                    v-for="card in getFormCards('灌装车间', '灌装生产记录1')"
                    :key="card.id"
                    class="placeholder-card"
                    shadow="hover"
                  >
                    <template #header>
                      <span style="text-align: center;">{{ card.formName }}</span>
                    </template>
                    <div>{{ card.content }}</div>
                    <div class="card-actions">
                      <el-button type="text" @click="handleAction('edit', card)">编辑</el-button>
                      <el-button type="text" @click="handleAction('review', card)">复核</el-button>
                      <el-button type="text" @click="handleAction('check', card)">检查</el-button>
                    </div>
                    <template #footer>
                      <span>{{ card.date }}</span>
                      <span style="margin-left: 10px;"></span>
                    </template>
                  </el-card>
                  <el-button type="text" class="add-page-btn" @click="openAddDialog">加页</el-button>
                </div>
              </div>
            </el-tab-pane>

            <!-- 灌装生产记录2 -->
            <el-tab-pane label="灌装生产记录2" name="灌装生产记录2">
              <div class="card-scroll-wrapper">
                <div class="card-list">
                  <el-card
                    v-for="card in getFormCards('灌装车间', '灌装生产记录2')"
                    :key="card.id"
                    class="placeholder-card"
                    shadow="hover"
                  >
                    <template #header>
                      <span style="text-align: center;">{{ card.formName }}</span>
                    </template>
                    <div>{{ card.content }}</div>
                    <div class="card-actions">
                      <el-button type="text" @click="handleAction('edit', card)">编辑</el-button>
                      <el-button type="text" @click="handleAction('review', card)">复核</el-button>
                      <el-button type="text" @click="handleAction('check', card)">检查</el-button>
                    </div>
                    <template #footer>
                      <span>{{ card.date }}</span>
                      <span style="margin-left: 10px;"></span>
                    </template>
                  </el-card>
                  <el-button type="text" class="add-page-btn" @click="openAddDialog">加页</el-button>
                </div>
              </div>
            </el-tab-pane>

            <!-- 清场记录 -->
            <el-tab-pane label="清场记录" name="清场记录">
              <div class="card-scroll-wrapper">
                <div class="card-list">
                  <el-card
                    v-for="card in getFormCards('灌装车间', '清场记录')"
                    :key="card.id"
                    class="placeholder-card"
                    shadow="hover"
                  >
                    <template #header>
                      <span style="text-align: center;">{{ card.formName }}</span>
                    </template>
                    <div>{{ card.content }}</div>
                    <div class="card-actions">
                      <el-button type="text" @click="handleAction('edit', card)">编辑</el-button>
                      <el-button type="text" @click="handleAction('review', card)">复核</el-button>
                      <el-button type="text" @click="handleAction('check', card)">检查</el-button>
                    </div>
                    <template #footer>
                      <span>{{ card.date }}</span>
                      <span style="margin-left: 10px;"></span>
                    </template>
                  </el-card>
                  <el-button type="text" class="add-page-btn" @click="openAddDialog">加页</el-button>
                </div>
              </div>
            </el-tab-pane>

            <!-- 退料单 -->
            <el-tab-pane label="退料单" name="退料单">
              <div class="card-scroll-wrapper">
                <div class="card-list">
                  <el-card
                    v-for="card in getFormCards('灌装车间', '退料单')"
                    :key="card.id"
                    class="placeholder-card"
                    shadow="hover"
                  >
                    <template #header>
                      <span style="text-align: center;">{{ card.formName }}</span>
                    </template>
                    <div>{{ card.content }}</div>
                    <div class="card-actions">
                      <el-button type="text" @click="handleAction('edit', card)">编辑</el-button>
                      <el-button type="text" @click="handleAction('review', card)">复核</el-button>
                      <el-button type="text" @click="handleAction('check', card)">检查</el-button>
                    </div>
                    <template #footer>
                      <span>{{ card.date }}</span>
                      <span style="margin-left: 10px;"></span>
                    </template>
                  </el-card>
                  <el-button type="text" class="add-page-btn" @click="openAddDialog">加页</el-button>
                </div>
              </div>
            </el-tab-pane>

            <!-- 物料平衡表 -->
            <el-tab-pane label="物料平衡表" name="物料平衡表">
              <div class="card-scroll-wrapper">
                <div class="card-list">
                  <el-card
                    v-for="card in getFormCards('灌装车间', '物料平衡表')"
                    :key="card.id"
                    class="placeholder-card"
                    shadow="hover"
                  >
                    <template #header>
                      <span style="text-align: center;">{{ card.formName }}</span>
                    </template>
                    <div>{{ card.content }}</div>
                    <div class="card-actions">
                      <el-button type="text" @click="handleAction('edit', card)">编辑</el-button>
                      <el-button type="text" @click="handleAction('review', card)">复核</el-button>
                      <el-button type="text" @click="handleAction('check', card)">检查</el-button>
                    </div>
                    <template #footer>
                      <span>{{ card.date }}</span>
                      <span style="margin-left: 10px;"></span>
                    </template>
                  </el-card>
                  <el-button type="text" class="add-page-btn" @click="openAddDialog">加页</el-button>
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
                  <el-card
                    v-for="card in getAllCards('包装车间')"
                    :key="card.id"
                    class="placeholder-card"
                    shadow="hover"
                  >
                    <template #header>
                      <span style="text-align: center;">{{ card.formName }}</span>
                    </template>
                    <div>{{ card.content }}</div>
                    <div class="card-actions">
                      <el-button type="text" @click="handleAction('edit', card)">编辑</el-button>
                      <el-button type="text" @click="handleAction('review', card)">复核</el-button>
                      <el-button type="text" @click="handleAction('check', card)">检查</el-button>
                    </div>
                    <template #footer>
                      <span>{{ card.date }}</span>
                      <span style="margin-left: 10px;">已归档</span>
                    </template>
                  </el-card>
                </div>
              </div>
            </el-tab-pane>

            <!-- 领料单 -->
            <el-tab-pane label="领料单" name="领料单">
              <div class="card-scroll-wrapper">
                <div class="card-list">
                  <el-card
                    v-for="card in getFormCards('包装车间', '领料单')"
                    :key="card.id"
                    class="placeholder-card"
                    shadow="hover"
                  >
                    <template #header>
                      <span style="text-align: center;">{{ card.formName }}</span>
                    </template>
                    <div>{{ card.content }}</div>
                    <div class="card-actions">
                      <el-button type="text" @click="handleAction('edit', card)">编辑</el-button>
                      <el-button type="text" @click="handleAction('review', card)">复核</el-button>
                      <el-button type="text" @click="handleAction('check', card)">检查</el-button>
                    </div>
                    <template #footer>
                      <span>{{ card.date }}</span>
                      <span style="margin-left: 10px;"></span>
                    </template>
                  </el-card>
                  <el-button type="text" class="add-page-btn" @click="openAddDialog">加页</el-button>
                </div>
              </div>
            </el-tab-pane>

            <!-- 外包生产记录1 -->
            <el-tab-pane label="外包生产记录1" name="外包生产记录1">
              <div class="card-scroll-wrapper">
                <div class="card-list">
                  <el-card
                    v-for="card in getFormCards('包装车间', '外包生产记录1')"
                    :key="card.id"
                    class="placeholder-card"
                    shadow="hover"
                  >
                    <template #header>
                      <span style="text-align: center;">{{ card.formName }}</span>
                    </template>
                    <div>{{ card.content }}</div>
                    <div class="card-actions">
                      <el-button type="text" @click="handleAction('edit', card)">编辑</el-button>
                      <el-button type="text" @click="handleAction('review', card)">复核</el-button>
                      <el-button type="text" @click="handleAction('check', card)">检查</el-button>
                    </div>
                    <template #footer>
                      <span>{{ card.date }}</span>
                      <span style="margin-left: 10px;"></span>
                    </template>
                  </el-card>
                  <el-button type="text" class="add-page-btn" @click="openAddDialog">加页</el-button>
                </div>
              </div>
            </el-tab-pane>

            <!-- 外包生产记录2 -->
            <el-tab-pane label="外包生产记录2" name="外包生产记录2">
              <div class="card-scroll-wrapper">
                <div class="card-list">
                  <el-card
                    v-for="card in getFormCards('包装车间', '外包生产记录2')"
                    :key="card.id"
                    class="placeholder-card"
                    shadow="hover"
                  >
                    <template #header>
                      <span style="text-align: center;">{{ card.formName }}</span>
                    </template>
                    <div>{{ card.content }}</div>
                    <div class="card-actions">
                      <el-button type="text" @click="handleAction('edit', card)">编辑</el-button>
                      <el-button type="text" @click="handleAction('review', card)">复核</el-button>
                      <el-button type="text" @click="handleAction('check', card)">检查</el-button>
                    </div>
                    <template #footer>
                      <span>{{ card.date }}</span>
                      <span style="margin-left: 10px;"></span>
                    </template>
                  </el-card>
                  <el-button type="text" class="add-page-btn" @click="openAddDialog">加页</el-button>
                </div>
              </div>
            </el-tab-pane>

            <!-- 外包生产记录3 -->
            <el-tab-pane label="外包生产记录3" name="外包生产记录3">
              <div class="card-scroll-wrapper">
                <div class="card-list">
                  <el-card
                    v-for="card in getFormCards('包装车间', '外包生产记录3')"
                    :key="card.id"
                    class="placeholder-card"
                    shadow="hover"
                  >
                    <template #header>
                      <span style="text-align: center;">{{ card.formName }}</span>
                    </template>
                    <div>{{ card.content }}</div>
                    <div class="card-actions">
                      <el-button type="text" @click="handleAction('edit', card)">编辑</el-button>
                      <el-button type="text" @click="handleAction('review', card)">复核</el-button>
                      <el-button type="text" @click="handleAction('check', card)">检查</el-button>
                    </div>
                    <template #footer>
                      <span>{{ card.date }}</span>
                      <span style="margin-left: 10px;"></span>
                    </template>
                  </el-card>
                  <el-button type="text" class="add-page-btn" @click="openAddDialog">加页</el-button>
                </div>
              </div>
            </el-tab-pane>

            <!-- 清场记录 -->
            <el-tab-pane label="清场记录" name="清场记录">
              <div class="card-scroll-wrapper">
                <div class="card-list">
                  <el-card
                    v-for="card in getFormCards('包装车间', '清场记录')"
                    :key="card.id"
                    class="placeholder-card"
                    shadow="hover"
                  >
                    <template #header>
                      <span style="text-align: center;">{{ card.formName }}</span>
                    </template>
                    <div>{{ card.content }}</div>
                    <div class="card-actions">
                      <el-button type="text" @click="handleAction('edit', card)">编辑</el-button>
                      <el-button type="text" @click="handleAction('review', card)">复核</el-button>
                      <el-button type="text" @click="handleAction('check', card)">检查</el-button>
                    </div>
                    <template #footer>
                      <span>{{ card.date }}</span>
                      <span style="margin-left: 10px;"></span>
                    </template>
                  </el-card>
                  <el-button type="text" class="add-page-btn" @click="openAddDialog">加页</el-button>
                </div>
              </div>
            </el-tab-pane>

            <!-- 入库单 -->
            <el-tab-pane label="入库单" name="入库单">
              <div class="card-scroll-wrapper">
                <div class="card-list">
                  <el-card
                    v-for="card in getFormCards('包装车间', '入库单')"
                    :key="card.id"
                    class="placeholder-card"
                    shadow="hover"
                  >
                    <template #header>
                      <span style="text-align: center;">{{ card.formName }}</span>
                    </template>
                    <div>{{ card.content }}</div>
                    <div class="card-actions">
                      <el-button type="text" @click="handleAction('edit', card)">编辑</el-button>
                      <el-button type="text" @click="handleAction('review', card)">复核</el-button>
                      <el-button type="text" @click="handleAction('check', card)">检查</el-button>
                    </div>
                    <template #footer>
                      <span>{{ card.date }}</span>
                      <span style="margin-left: 10px;"></span>
                    </template>
                  </el-card>
                  <el-button type="text" class="add-page-btn" @click="openAddDialog">加页</el-button>
                </div>
              </div>
            </el-tab-pane>

            <!-- 退料单 -->
            <el-tab-pane label="退料单" name="退料单">
              <div class="card-scroll-wrapper">
                <div class="card-list">
                  <el-card
                    v-for="card in getFormCards('包装车间', '退料单')"
                    :key="card.id"
                    class="placeholder-card"
                    shadow="hover"
                  >
                    <template #header>
                      <span style="text-align: center;">{{ card.formName }}</span>
                    </template>
                    <div>{{ card.content }}</div>
                    <div class="card-actions">
                      <el-button type="text" @click="handleAction('edit', card)">编辑</el-button>
                      <el-button type="text" @click="handleAction('review', card)">复核</el-button>
                      <el-button type="text" @click="handleAction('check', card)">检查</el-button>
                    </div>
                    <template #footer>
                      <span>{{ card.date }}</span>
                      <span style="margin-left: 10px;"></span>
                    </template>
                  </el-card>
                  <el-button type="text" class="add-page-btn" @click="openAddDialog">加页</el-button>
                </div>
              </div>
            </el-tab-pane>

            <!-- 物料平衡表 -->
            <el-tab-pane label="物料平衡表" name="物料平衡表">
              <div class="card-scroll-wrapper">
                <div class="card-list">
                  <el-card
                    v-for="card in getFormCards('包装车间', '物料平衡表')"
                    :key="card.id"
                    class="placeholder-card"
                    shadow="hover"
                  >
                    <template #header>
                      <span style="text-align: center;">{{ card.formName }}</span>
                    </template>
                    <div>{{ card.content }}</div>
                    <div class="card-actions">
                      <el-button type="text" @click="handleAction('edit', card)">编辑</el-button>
                      <el-button type="text" @click="handleAction('review', card)">复核</el-button>
                      <el-button type="text" @click="handleAction('check', card)">检查</el-button>
                    </div>
                    <template #footer>
                      <span>{{ card.date }}</span>
                      <span style="margin-left: 10px;"></span>
                    </template>
                  </el-card>
                  <el-button type="text" class="add-page-btn" @click="openAddDialog">加页</el-button>
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
        <el-button type="text" @click="clearOperation">关闭</el-button>
      </div>
      <div class="operation-body">
        <div v-if="operationArea.mode === 'edit'">
          <el-input
            v-model="editContent"
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
          />
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
          <el-date-picker
            v-model="addForm.date"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择日期"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>


<script>
export default {
  name: 'Workspace',
  data() {
    return {
      activeWorkshop: '消毒车间',
      activeForm: '全部',
      cardsData: {
        '消毒车间': {
          '领料单': [
            { id: 'd1_f1_c1', date: '2026-07-13', content: '领料单内容示例', formName: '领料单' },
          ],
          '处理记录1': [
            { id: 'd1_f2_c1', date: '2026-07-13', content: '处理记录1内容示例', formName: '处理记录1' },
          ],
          '处理记录2': [
            { id: 'd1_f3_c1', date: '2026-07-13', content: '处理记录2内容示例', formName: '处理记录2' },
          ],
          '清场记录': [
            { id: 'd1_f4_c1', date: '2026-07-13', content: '清场记录内容示例', formName: '清场记录' },
          ],
        },
        '灌装车间': {
          '领料单': [
            { id: 'g1_f1_c1', date: '2026-07-13', content: '领料单内容示例', formName: '领料单' },
          ],
          '灌装生产记录1': [
            { id: 'g1_f2_c1', date: '2026-07-13', content: '灌装生产记录1内容示例', formName: '灌装生产记录1' },
          ],
          '灌装生产记录2': [
            { id: 'g1_f3_c1', date: '2026-07-13', content: '灌装生产记录2内容示例', formName: '灌装生产记录2' },
          ],
          '清场记录': [
            { id: 'g1_f5_c1', date: '2026-07-13', content: '清场记录内容示例', formName: '清场记录' },
          ],
          '退料单': [
            { id: 'g1_f4_c1', date: '2026-07-13', content: '退料单内容示例', formName: '退料单' },
            { id: 'g1_f4_c2', date: '2026-07-13', content: '退料单内容示例', formName: '退料单' },
          ],
          '物料平衡表': [
            { id: 'g1_f6_c1', date: '2026-07-13', content: '物料平衡表内容示例', formName: '物料平衡表' },
          ],
        },
        '包装车间': {
          '领料单': [
            { id: 'b1_f1_c1', date: '2026-07-13', content: '领料单内容示例', formName: '领料单' },
            { id: 'b1_f1_c2', date: '2026-07-13', content: '领料单内容示例', formName: '领料单' },
          ],
          '外包生产记录1': [
            { id: 'b1_f2_c1', date: '2026-07-13', content: '外包生产记录1内容示例', formName: '外包生产记录1' },
          ],
          '外包生产记录2': [
            { id: 'b1_f3_c1', date: '2026-07-13', content: '外包生产记录2内容示例', formName: '外包生产记录2' },
          ],
          '外包生产记录3': [
            { id: 'b1_f4_c1', date: '2026-07-13', content: '外包生产记录3内容示例', formName: '外包生产记录3' },
          ],
          '清场记录': [
            { id: 'b1_f7_c1', date: '2026-07-13', content: '清场记录内容示例', formName: '清场记录' },
          ],
          '入库单': [
            { id: 'b1_f5_c1', date: '2026-07-13', content: '入库单内容示例', formName: '入库单' },
          ],
          '退料单': [
            { id: 'b1_f6_c1', date: '2026-07-13', content: '退料单内容示例', formName: '退料单' },
            { id: 'b1_f6_c2', date: '2026-07-14', content: '退料单内容示例', formName: '退料单' },
          ],
          '物料平衡表': [
            { id: 'b1_f8_c1', date: '2026-07-13', content: '物料平衡表内容示例', formName: '物料平衡表' },
          ],
        },
      },
      operationArea: {
        mode: null,
        card: null,
      },
      editContent: '',
      addDialogVisible: false,
      addForm: { date: null },
      addFormRef: null,
      addRules: {
        date: [{ required: true, message: '请选择日期', trigger: 'change' }],
      },
    };
  },
  methods: {
    getFormCards(workshopName, formName) {
      const workshop = this.cardsData[workshopName];
      if (!workshop) return [];
      return workshop[formName] || [];
    },
    getAllCards(workshopName) {
      const workshop = this.cardsData[workshopName];
      if (!workshop) return [];
      const all = [];
      Object.keys(workshop).forEach(formName => {
        all.push(...workshop[formName]);
      });
      // 可按日期排序（可选）
      // all.sort((a, b) => new Date(a.date) - new Date(b.date));
      return all;
    },
    getCurrentForm() {
      if (this.activeForm === '全部') return null;
      const workshop = this.cardsData[this.activeWorkshop];
      if (!workshop) return null;
      return workshop[this.activeForm] || null;
    },
    handleAction(mode, card) {
      this.operationArea.mode = mode;
      this.operationArea.card = card;
      if (mode === 'edit') {
        this.editContent = card.content;
      }
    },
    clearOperation() {
      this.operationArea.mode = null;
      this.operationArea.card = null;
      this.editContent = '';
    },
    submitEdit() {
      this.$confirm('确认提交修改？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          alert('提交成功！修改内容：' + this.editContent);
          if (this.operationArea.card) {
            this.operationArea.card.content = this.editContent;
          }
          this.clearOperation();
        })
        .catch(() => {});
    },
    submitReviewOrCheck() {
      const action = this.operationArea.mode === 'review' ? '复核' : '检查';
      this.$confirm(`确认${action}通过？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          alert(`${action}成功！`);
          this.clearOperation();
        })
        .catch(() => {});
    },
    openAddDialog() {
      if (this.activeForm === '全部') {
        this.$message.warning('请先切换到具体表单再添加日期');
        return;
      }
      this.addForm.date = null;
      this.addDialogVisible = true;
      this.$nextTick(() => {
        const formRef = this.$refs.addFormRef;
        if (formRef) {
          formRef.resetFields();
        }
      });
    },
    handleAddSubmit() {
      const formRef = this.$refs.addFormRef;
      if (!formRef) {
        this.$message.error('表单未加载，请重试');
        return;
      }
      formRef.validate((valid) => {
        if (!valid) return;
        const selectedDate = this.addForm.date;
        const formCards = this.getCurrentForm();
        if (!formCards) {
          this.$message.error('未找到当前表单数据');
          return;
        }
        const exists = formCards.some((c) => c.date === selectedDate);
        if (exists) {
          this.$message.warning('该日期已存在，请选择其他日期');
          return;
        }
        const newCard = {
          id: `card_${Date.now()}`,
          date: selectedDate,
          content: '待填写',
          formName: this.activeForm,
        };
        formCards.push(newCard);
        this.$nextTick(() => {
          this.scrollToNewCard();
        });
        this.addDialogVisible = false;
        this.$message.success('添加成功');
      });
    },
    scrollToNewCard() {
      const wrapper = this.$el.querySelector('.card-scroll-wrapper');
      if (wrapper) {
        wrapper.scrollTop = wrapper.scrollHeight;
      }
    },
  },
};
</script>

<style scoped>
/* ===== 强制所有父容器宽度固定 ===== */
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

/* ===== 滚动容器：垂直滚动 ===== */
.card-scroll-wrapper {
  height: 450px;
  width: 100% !important;
  max-width: 100% !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  padding: 8px 0;
}

/* ===== 卡片列表：flex 换行 ===== */
.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
  padding: 4px 0;
  align-content: flex-start;
}

/* ===== 卡片：固定宽高 190px ===== */
.placeholder-card {
  flex: 0 0 188px;          /* 固定宽度 */
  height: 190px;            /* 固定高度 */
  min-width: 0;
  transition: transform 0.2s;
}
.placeholder-card:hover {
  transform: translateY(-4px);
}

/* ===== 加页按钮：固定宽高 190px ===== */
.add-page-btn {
  flex: 0 0 190px;          /* 固定宽度 */
  height: 190px;            /* 固定高度 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
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

/* ===== 卡片底部按钮 ===== */
.card-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
}
.card-actions .el-button--text {
  padding: 0;
  margin: 0;
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

/* ===== 覆盖默认样式 ===== */
.app-container {
  padding: 0;
}
</style>



