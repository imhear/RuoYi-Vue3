<template>
  <el-dialog
    v-model="visible"
    :fullscreen="isFullscreen"
    width="1600px"
    top="1vh"
    append-to-body
    class="design-config-dialog"
    @closed="handleClosed"
  >
    <!-- 自定义 header：左侧标题（设计态配置 [方案名称|方案编码]），右侧全屏按钮（切换对话框 fullscreen） -->
    <template #header>
      <div class="design-config-header">
        <span class="design-config-title">{{ dialogTitle }}</span>
        <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
          <svg-icon
            :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
            class="design-config-fullscreen-icon"
            @click="toggleFullscreen"
          />
        </el-tooltip>
      </div>
    </template>

    <el-row :gutter="16" class="design-config-body-row">
      <!-- 左侧：方案菜单树 -->
      <el-col :span="5">
        <div class="tree-panel">
          <div class="panel-header">
            <span>方案目录树</span>
            <span class="panel-actions">
              <!-- 折叠/展开按钮：放在"新增根目录"前，点击切换整棵树的展开状态 -->
              <el-button
                link
                type="primary"
                :icon="isExpandAll ? 'Fold' : 'Expand'"
                @click="toggleExpandAll"
              >{{ isExpandAll ? '折叠' : '展开' }}</el-button>
              <el-button link type="primary" icon="Plus" @click="handleAddRoot">新增根目录</el-button>
            </span>
          </div>
          <div class="tree-body" v-loading="treeLoading">
            <el-tree
              v-if="refreshTree"
              ref="treeRef"
              :data="treeData"
              node-key="menuId"
              :default-expand-all="isExpandAll"
              :expand-on-click-node="false"
              highlight-current
              @node-click="handleNodeClick"
            >
              <template #default="{ data }">
                <div class="tree-node">
                  <el-icon class="node-icon">
                    <Folder v-if="data.menuType === 'M'" />
                    <Document v-else-if="data.menuType === 'C'" />
                    <Operation v-else />
                  </el-icon>
                  <span class="node-label">{{ data.menuName }}</span>
                  <span class="node-actions">
                    <!-- 预览按钮：仅 C 类型节点显示，放在其他图标按钮之前 -->
                    <el-tooltip v-if="data.menuType === 'C'" content="预览组件" placement="top">
                      <el-button link type="primary" size="small" @click.stop="handlePreview(data)">
                        <svg-icon icon-class="eye-open" class="action-icon" />
                      </el-button>
                    </el-tooltip>
                    <el-tooltip v-if="data.menuType !== 'F'" content="新增子节点" placement="top">
                      <el-button link type="primary" icon="Plus" size="small" @click.stop="handleAddChild(data)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="编辑" placement="top">
                      <el-button link type="primary" icon="Edit" size="small" @click.stop="handleEdit(data)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                      <el-button link type="danger" icon="Delete" size="small" @click.stop="handleDelete(data)"></el-button>
                    </el-tooltip>
                  </span>
                </div>
              </template>
            </el-tree>
          </div>
        </div>
      </el-col>

      <!-- 右侧：节点详情 / 组件预览 -->
      <el-col :span="19">
        <div class="detail-panel">
          <div class="panel-header">
            <!-- 标题动态切换：预览模式下显示"组件预览：xxx"，否则显示"节点详情" -->
            <span>{{ previewNode ? '组件预览：' + previewNode.menuName : '节点详情' }}</span>
            <!-- 预览模式下提供"返回详情"按钮 -->
            <el-button
              v-if="previewNode"
              link
              type="primary"
              icon="Back"
              @click="handleBackToDetail"
            >返回详情</el-button>
          </div>
          <div class="detail-body">
            <!-- 预览模式：动态渲染 C 节点的前端组件 -->
            <div v-if="previewNode" class="component-preview">
              <component v-if="previewComponent" :is="previewComponent" />
              <el-empty v-else description="该节点不支持预览" />
            </div>

            <!-- 详情模式：显示当前选中节点详情 -->
            <template v-else>
              <div v-if="currentNode">
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="菜单ID">{{ currentNode.menuId }}</el-descriptions-item>
                  <el-descriptions-item label="菜单名称">{{ currentNode.menuName }}</el-descriptions-item>
                  <el-descriptions-item label="菜单类型">
                    <el-tag :type="menuTypeTag(currentNode.menuType)">{{ menuTypeText(currentNode.menuType) }}</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="父菜单ID">{{ currentNode.parentId }}</el-descriptions-item>
                  <el-descriptions-item label="显示顺序">{{ currentNode.orderNum }}</el-descriptions-item>
                  <el-descriptions-item label="前端路由地址">{{ currentNode.path || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="前端组件路径">{{ currentNode.component || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="后端接口路径">{{ currentNode.backendRoute || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="操作码">{{ currentNode.operationCode || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="物理表名">{{ currentNode.tableName || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="权限标识">{{ currentNode.perms || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="路由参数">{{ currentNode.query || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="自定义参数">{{ currentNode.customParams || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="前置菜单ID">{{ currentNode.predecessorDetailId || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="卡片显示">{{ currentNode.operationVisible === '1' ? '是' : '否' }}</el-descriptions-item>
                  <el-descriptions-item label="状态">{{ currentNode.status === '0' ? '正常' : '停用' }}</el-descriptions-item>
                  <el-descriptions-item label="是否可反审">{{ currentNode.isUnaudit === '0' ? '是' : '否' }}</el-descriptions-item>
                  <el-descriptions-item label="备注">{{ currentNode.remark || '-' }}</el-descriptions-item>
                </el-descriptions>
                <div class="detail-actions">
                  <el-button type="primary" @click="handleEdit(currentNode)">编辑</el-button>
                  <el-button v-if="currentNode.menuType !== 'F'" @click="handleAddChild(currentNode)">新增子节点</el-button>
                </div>
              </div>
              <el-empty v-else description="请选择左侧节点查看详情" />
            </template>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 新增/编辑节点对话框（完整 sys_menu 字段 + 设计态专用字段） -->
    <el-dialog
      v-model="editDialogVisible"
      :title="editForm.menuId ? '编辑节点' : '新增节点'"
      width="680px"
      append-to-body
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px">
        <el-row>
          <!-- 上级节点 -->
          <el-col :span="24">
            <el-form-item label="上级节点">
              <el-tree-select
                v-model="editForm.parentId"
                :data="treeData"
                :props="{ value: 'menuId', label: 'menuName', children: 'children' }"
                node-key="menuId"
                placeholder="选择上级节点"
                check-strictly
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <!-- 节点类型 -->
          <el-col :span="24">
            <el-form-item label="节点类型">
              <el-radio-group v-model="editForm.menuType" @change="handleMenuTypeChange" :disabled="!!editForm.menuId">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <!-- 菜单图标（非按钮） -->
          <el-col :span="12" v-if="editForm.menuType !== 'F'">
            <el-form-item label="菜单图标">
              <el-input v-model="editForm.icon" placeholder="请输入图标" />
            </el-form-item>
          </el-col>

          <!-- 显示排序 -->
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="editForm.orderNum" controls-position="right" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>

          <!-- 菜单名称 -->
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="editForm.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>

          <!-- 路由名称（C） -->
          <el-col :span="12" v-if="editForm.menuType === 'C'">
            <el-form-item prop="routeName">
              <template #label>
                <span>
                  <el-tooltip content="默认不填则和路由地址相同：如地址为：`user`，则名称为`User`（注意：因为router会删除名称相同路由，为避免名字的冲突，特殊情况下请自定义，保证唯一性）" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  路由名称
                </span>
              </template>
              <el-input v-model="editForm.routeName" placeholder="请输入路由名称" />
            </el-form-item>
          </el-col>

          <!-- 是否外链（非按钮） -->
          <el-col :span="12" v-if="editForm.menuType !== 'F'">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>是否外链
                </span>
              </template>
              <el-radio-group v-model="editForm.isFrame">
                <el-radio value="0">是</el-radio>
                <el-radio value="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <!-- 前端路由地址（非按钮） -->
          <el-col :span="12" v-if="editForm.menuType !== 'F'">
            <el-form-item prop="path">
              <template #label>
                <span>
                  <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  前端路由地址
                </span>
              </template>
              <el-input v-model="editForm.path" placeholder="请输入前端路由地址" />
            </el-form-item>
          </el-col>

          <!-- 前端组件路径（C） -->
          <el-col :span="12" v-if="editForm.menuType === 'C'">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  前端组件路径
                </span>
              </template>
              <el-input v-model="editForm.component" placeholder="请输入前端组件路径" />
            </el-form-item>
          </el-col>

          <!-- 权限标识（非目录） -->
          <el-col :span="12" v-if="editForm.menuType !== 'M'">
            <el-form-item>
              <el-input v-model="editForm.perms" placeholder="请输入权限标识" maxlength="100" disabled/>
              <template #label>
                <span>
                  <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  权限标识
                </span>
              </template>
            </el-form-item>
          </el-col>

          <!-- 路由参数（C） -->
          <el-col :span="12" v-if="editForm.menuType === 'C'">
            <el-form-item>
              <el-input v-model="editForm.query" placeholder="请输入路由参数" maxlength="255" />
              <template #label>
                <span>
                  <el-tooltip content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`' placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  路由参数
                </span>
              </template>
            </el-form-item>
          </el-col>

          <!-- 是否缓存（C） -->
          <el-col :span="12" v-if="editForm.menuType === 'C'">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  是否缓存
                </span>
              </template>
              <el-radio-group v-model="editForm.isCache">
                <el-radio value="0">缓存</el-radio>
                <el-radio value="1">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <!-- 显示状态（非按钮） -->
          <el-col :span="12" v-if="editForm.menuType !== 'F'">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  显示状态
                </span>
              </template>
              <el-radio-group v-model="editForm.visible">
                <el-radio value="0">显示</el-radio>
                <el-radio value="1">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <!-- 菜单状态 -->
          <el-col :span="12">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  菜单状态
                </span>
              </template>
              <el-radio-group v-model="editForm.status">
                <el-radio value="0">正常</el-radio>
                <el-radio value="1">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <!-- ========== 设计态专用字段 ========== -->

          <!-- C 菜单专用：选择系统菜单（el-tree-select） -->
          <el-col :span="24" v-if="editForm.menuType === 'C'">
            <el-form-item label="系统菜单">
              <el-tree-select
                v-model="selectedSysMenuId"
                :data="sysMenuTreeData"
                :props="sysMenuTreeProps"
                node-key="menuId"
                check-strictly
                placeholder="请选择系统菜单"
                style="width: 100%"
                @change="handleSysMenuSelect"
              />
            </el-form-item>
          </el-col>

          <!-- C 菜单专用：物理表名 -->
          <el-col :span="24" v-if="editForm.menuType === 'C'">
            <el-form-item label="物理表名" prop="tableName">
              <el-input v-model="editForm.tableName" placeholder="请选择物理表" readonly>
                <template #append>
                  <el-button icon="Search" @click="openSelectTable" />
                </template>
              </el-input>
            </el-form-item>
          </el-col>

          <!-- C 菜单专用：自定义参数 -->
          <el-col :span="24" v-if="editForm.menuType === 'C'">
            <el-form-item label="自定义参数">
              <el-input v-model="editForm.customParams" placeholder='如 {"MaterialType":"PACKAGING_MATERIAL"}' />
            </el-form-item>
          </el-col>

          <!-- C 菜单专用：前置菜单ID -->
          <el-col :span="24" v-if="editForm.menuType === 'C'">
            <el-form-item label="前置菜单ID">
              <el-input-number v-model="editForm.predecessorDetailId" :min="0" style="width: 100%" placeholder="前置菜单ID" />
            </el-form-item>
          </el-col>

          <!-- F 按钮专用：选择系统按钮权限（el-tree-select） -->
          <el-col :span="12" v-if="editForm.menuType === 'F'">
            <el-form-item label="系统按钮权限">
              <el-tree-select
                v-model="selectedSysMenuId"
                :data="sysMenuTreeData"
                :props="sysMenuTreeProps"
                node-key="menuId"
                check-strictly
                placeholder="请选择系统按钮权限"
                style="width: 100%"
                @change="handleSysMenuSelect"
              />
            </el-form-item>
          </el-col>

          <!-- F 按钮专用：操作码 -->
          <el-col :span="12" v-if="editForm.menuType === 'F'">
            <el-form-item label="操作码" prop="operationCode">
              <el-input v-model="editForm.operationCode" placeholder="请选择操作码" readonly>
                <template #append>
                  <el-button icon="Search" @click="openSelectOperation" />
                </template>
              </el-input>
            </el-form-item>
          </el-col>

          <!-- F 按钮专用：操作类型（只读，自动带出） -->
          <el-col :span="12" v-if="editForm.menuType === 'F'">
            <el-form-item label="操作类型">
              <el-input v-model="editForm.actionType" placeholder="自动带出" disabled />
            </el-form-item>
          </el-col>

          <!-- F 按钮专用：按钮标签 -->
          <el-col :span="12" v-if="editForm.menuType === 'F'">
            <el-form-item label="按钮标签">
              <el-input v-model="editForm.buttonLabel" placeholder="如：编辑、提交、复核" disabled/>
            </el-form-item>
          </el-col>

          <!-- F 按钮专用：前端路由地址（选填） -->
          <el-col :span="24" v-if="editForm.menuType === 'F'">
            <el-form-item label="前端路由地址">
              <el-input v-model="editForm.path" placeholder="请输入前端路由地址（选填）" />
            </el-form-item>
          </el-col>

          <!-- F 按钮专用：前端组件路径（自动回填，可修改） -->
          <el-col :span="24" v-if="editForm.menuType === 'F'">
            <el-form-item label="前端组件路径">
              <el-input v-model="editForm.component" placeholder="自动带出，可修改" disabled/>
            </el-form-item>
          </el-col>

          <!-- F 按钮专用：路由参数（选填） -->
          <el-col :span="24" v-if="editForm.menuType === 'F'">
            <el-form-item label="路由参数">
              <el-input v-model="editForm.query" placeholder="请输入路由参数（选填）" />
            </el-form-item>
          </el-col>

          <!-- F 按钮专用：后端接口路径 -->
          <el-col :span="24" v-if="editForm.menuType === 'F'">
            <el-form-item label="后端接口路径">
              <el-input v-model="editForm.backendRoute" placeholder="自动带出，可修改" disabled/>
            </el-form-item>
          </el-col>

          <!-- F 按钮专用：卡片显示 -->
          <el-col :span="24" v-if="editForm.menuType === 'F'">
            <el-form-item label="卡片显示">
              <el-radio-group v-model="editForm.operationVisible">
                <el-radio label="1">显示</el-radio>
                <el-radio label="0">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <!-- F 按钮专用：是否可反审 -->
          <el-col :span="24" v-if="editForm.menuType === 'F'">
            <el-form-item label="是否可反审">
              <el-radio-group v-model="editForm.isUnaudit">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <!-- 备注 -->
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="editForm.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 选择物理表对话框（来自 basic 模块） -->
    <SelectTable ref="selectTableRef" @ok="onFormSelected" />
    <!-- 选择操作码对话框 -->
    <SelectOperation ref="selectOperationRef" @ok="onOperationSelected" />
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, nextTick, shallowRef, defineAsyncComponent } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Folder, Document, Operation, Plus, Edit, Delete, Search, QuestionFilled } from '@element-plus/icons-vue'
import SelectTable from '@/views/basic/components/SelectTable.vue'
import SelectOperation from '@/views/basic/components/SelectOperation.vue'
import { listMenu } from "@/api/system/menu"
import { getScheme_design } from "@/api/fill/scheme_design"
import { listScheme_design_menu, addScheme_design_menu, updateScheme_design_menu, delScheme_design_menu } from "@/api/fill/scheme_design_menu"

defineOptions({ name: 'DesignConfigDialog' })

const props = defineProps({
  schemeId: { type: Number, required: true }
})

// ==================== 状态定义 ====================
const visible = ref(false)
const treeRef = ref(null)
const treeLoading = ref(false)
const treeData = ref([])
const currentNode = ref(null)
const schemeInfo = ref(null)   // 方案基本信息

const editDialogVisible = ref(false)
const editFormRef = ref(null)
const selectTableRef = ref(null)
const selectOperationRef = ref(null)

/** 系统菜单树数据（用于 el-tree-select） */
const sysMenuTreeData = ref([])

/** 当前选中的系统菜单ID（用于 el-tree-select 回显） */
const selectedSysMenuId = ref(null)

/** 方案目录树的展开状态：true 全部展开，false 全部折叠 */
const isExpandAll = ref(true)

/** 强制重渲染方案目录树的开关：切换展开/折叠时先置 false 再置 true，让 el-tree 重新应用 default-expand-all */
const refreshTree = ref(true)

/** 当前预览的节点（非空时右侧显示组件预览） */
const previewNode = ref(null)

/** 当前预览的动态组件（由 previewNode.component 异步加载得到） */
const previewComponent = shallowRef(null)

/** 对话框全屏状态：true 时 el-dialog 通过 fullscreen 属性铺满整个屏幕 */
const isFullscreen = ref(false)

/**
 * 前端组件模块映射表
 *
 * 使用 Vite 的 import.meta.glob 在构建时收集 /src/views 下所有 .vue 文件，
 * 返回一个 key=文件绝对路径、value=动态 import 函数的对象。
 * 点击 C 类型节点的 eye-open 按钮时，根据 component 字段拼出完整路径并从中查找。
 * 参考 src/views/batch/components/BatchRecordView.vue 的实现方式。
 */
const modules = import.meta.glob('/src/views/**/*.vue')

/** 编辑表单（包含 sys_menu 全部字段 + 设计态专用字段） */
const editForm = reactive({
  menuId: null,
  schemeId: props.schemeId,
  menuType: 'M',
  parentId: 0,
  menuName: '',
  orderNum: 0,
  path: '',
  component: '',
  query: '',
  routeName: '',
  isFrame: '1',
  isCache: '0',
  visible: '0',
  status: '0',
  isUnaudit: '1',
  perms: '',
  icon: '#',
  remark: '',
  backendRoute: '',
  tableName: '',
  customParams: '',
  predecessorDetailId: null,
  operationCode: '',
  actionType: '', 
  buttonLabel: '',
  operationVisible: '1'
})

/**
 * 对话框标题
 *
 * 格式：设计态配置 [方案名称|方案编码]
 * - 方案信息未加载时，仅显示"设计态配置"
 * - 只有名称或只有编码时，只显示有值的那一项
 */
const dialogTitle = computed(() => {
  const s = schemeInfo.value
  if (!s) return '设计态配置'
  const name = s.schemeName || ''
  const code = s.schemeCode || ''
  if (name && code) return `设计态配置 [${name}|${code}]`
  if (name) return `设计态配置 [${name}]`
  if (code) return `设计态配置 [${code}]`
  return '设计态配置'
})

/**
 * 表单校验规则
 * 
 * F 节点（按钮）的校验增加了 perms 必填：
 * 权限标识的权威来源是 sys_menu.perms，设计态必须从系统菜单按钮中独立选择。
 * 这是防止生成批记录后 v-hasPermi('') 空值导致前端异常的强校验。
 */
const editRules = computed(() => {
  const rules = {
    menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
    orderNum: [{ required: true, message: '显示排序不能为空', trigger: 'blur' }]
  }
  if (editForm.menuType === 'C') {
    rules.tableName = [{ required: true, message: '请选择物理表', trigger: 'change' }]
    rules.path = [{ required: true, message: '前端路由地址不能为空', trigger: 'blur' }]
  } else if (editForm.menuType === 'F') {
    rules.operationCode = [{ required: true, message: '请选择操作码', trigger: 'change' }]
    rules.perms = [{ required: true, message: '请选择系统按钮权限（权限标识）', trigger: 'change' }]
  }
  return rules
})

/**
 * el-tree-select 的 props，根据节点类型动态禁用不可选节点
 */
const sysMenuTreeProps = computed(() => {
  const requiredType = editForm.menuType === 'C' ? 'C' : 'F'
  return {
    label: 'menuName',
    children: 'children',
    disabled: (data) => data.menuType !== requiredType
  }
})

// ==================== 工具方法 ====================
function menuTypeText(type) {
  const map = { M: '目录', C: '菜单', F: '按钮' }
  return map[type] || type
}
function menuTypeTag(type) {
  const map = { M: 'warning', C: 'success', F: 'info' }
  return map[type] || ''
}

// ==================== 数据加载 ====================
/**
 * 加载当前方案基本信息
 */
async function loadSchemeInfo() {
  try {
    const res = await getScheme_design(props.schemeId)
    schemeInfo.value = res.data || null
  } catch (e) {
    ElMessage.error('加载方案信息失败')
  }
}

/**
 * 加载当前方案的菜单树
 */
async function loadTree() {
  treeLoading.value = true
  try {
    const res = await listScheme_design_menu({ schemeId: props.schemeId, pageNum: 1, pageSize: 1000 })
    const list = res.data || res.rows || []
    const filtered = list.filter(item => item.schemeId === props.schemeId)
    treeData.value = buildMenuTree(filtered)
  } catch (e) {
    ElMessage.error('加载菜单树失败')
  } finally {
    treeLoading.value = false
  }
}

/**
 * 构建方案菜单树
 */
function buildMenuTree(list) {
  const map = {}
  list.forEach(item => {
    item.children = []
    map[item.menuId] = item
  })
  const tree = []
  list.forEach(item => {
    if (item.parentId === 0 || !map[item.parentId]) {
      tree.push(item)
    } else {
      const parent = map[item.parentId]
      if (parent) parent.children.push(item)
    }
  })
  sortChildren(tree)
  return tree
}

/**
 * 递归按 orderNum 排序
 */
function sortChildren(nodes) {
  nodes.forEach(node => {
    if (node.children && node.children.length > 0) {
      node.children.sort((a, b) => (a.orderNum || 0) - (b.orderNum || 0))
      sortChildren(node.children)
    }
  })
}

/**
 * 加载系统菜单树（用于 el-tree-select）
 */
async function loadSysMenuTree() {
  try {
    const res = await listMenu()
    const list = res.data || []
    sysMenuTreeData.value = buildSysMenuTree(list)
  } catch (e) {
    ElMessage.error('加载系统菜单树失败')
  }
}

/**
 * 构建系统菜单树（将平铺数据转为树形）
 */
function buildSysMenuTree(list) {
  const map = {}
  list.forEach(item => {
    item.children = []
    map[item.menuId] = item
  })
  const tree = []
  list.forEach(item => {
    if (item.parentId === 0 || !map[item.parentId]) {
      tree.push(item)
    } else {
      const parent = map[item.parentId]
      if (parent) parent.children.push(item)
    }
  })
  return tree
}

/**
 * 在树中查找节点
 */
function findNodeById(nodes, id) {
  for (const node of nodes) {
    if (node.menuId === id) return node
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, id)
      if (found) return found
    }
  }
  return null
}

/**
 * 在系统菜单树中根据 perms 查找节点
 */
function findNodeByPerms(nodes, perms) {
  for (const node of nodes) {
    if (node.perms === perms) return node
    if (node.children && node.children.length > 0) {
      const found = findNodeByPerms(node.children, perms)
      if (found) return found
    }
  }
  return null
}

// ==================== 打开/关闭 ====================
async function open() {
  visible.value = true
  currentNode.value = null
  previewNode.value = null
  previewComponent.value = null
  await Promise.all([loadTree(), loadSysMenuTree(), loadSchemeInfo()])
}

function close() {
  visible.value = false
}

function handleClosed() {
  currentNode.value = null
  previewNode.value = null
  previewComponent.value = null
  // 关闭对话框时，同步退出全屏状态，避免下次打开时仍保持全屏
  isFullscreen.value = false
}

// ==================== 全屏切换 ====================

/**
 * 切换对话框全屏
 *
 * 通过 el-dialog 的 fullscreen 属性控制，让对话框铺满整个屏幕（不是浏览器级全屏）。
 * 与浏览器 API（Screenfull / useFullscreen）不同，这里只影响对话框自身，
 * 不会触发页面级的全屏状态变化，是"对话框占满屏幕"的标准做法。
 */
function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}

// ==================== 树节点操作 ====================

/**
 * 折叠/展开方案目录树
 *
 * 实现方式：先关闭 el-tree 的 v-if 让组件销毁，切换 isExpandAll 后再重新挂载，
 * 使 el-tree 重新应用 default-expand-all 属性。
 * 参考 src/views/system/menu/index.vue 中"展开/折叠"的官方实现方式。
 * 重新渲染后，通过 treeRef.setCurrentKey 恢复之前选中的节点高亮。
 */
function toggleExpandAll() {
  refreshTree.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTree.value = true
    // 树重新渲染后恢复选中高亮
    nextTick(() => {
      if (currentNode.value && treeRef.value) {
        treeRef.value.setCurrentKey(currentNode.value.menuId)
      }
    })
  })
}

/**
 * 单击树节点
 *
 * 更新 currentNode 用于右侧详情展示；同时退出预览模式，
 * 保证点击非预览按钮的节点时，右侧立即回到详情视图。
 */
function handleNodeClick(data) {
  currentNode.value = data
  if (previewNode.value) {
    previewNode.value = null
    previewComponent.value = null
  }
}

function handleAddRoot() {
  openEditDialog('M', 0, null)
}

function handleAddChild(node) {
  if (node.menuType === 'M') {
    openEditDialog('C', node.menuId, null)
  } else if (node.menuType === 'C') {
    openEditDialog('F', node.menuId, null)
  }
}

function handleEdit(node) {
  openEditDialog(node.menuType, node.parentId, node)
}

/**
 * 打开编辑对话框
 */
function openEditDialog(menuType, parentId, nodeData) {
  Object.assign(editForm, {
    menuId: nodeData ? nodeData.menuId : null,
    schemeId: props.schemeId,
    menuType: menuType,
    parentId: parentId || 0,
    menuName: nodeData?.menuName || '',
    orderNum: nodeData?.orderNum || 0,
    path: nodeData?.path || '',
    component: nodeData?.component || '',
    query: nodeData?.query || '',
    routeName: nodeData?.routeName || '',
    isFrame: nodeData?.isFrame !== undefined ? String(nodeData.isFrame) : '1',
    isCache: nodeData?.isCache !== undefined ? String(nodeData.isCache) : '0',
    visible: nodeData?.visible || '0',
    status: nodeData?.status || '0',
    isUnaudit: nodeData?.isUnaudit ?? '1',
    perms: nodeData?.perms || '',
    icon: nodeData?.icon || '#',
    remark: nodeData?.remark || '',
    backendRoute: nodeData?.backendRoute || '',
    tableName: nodeData?.tableName || '',
    customParams: nodeData?.customParams || '',
    predecessorDetailId: nodeData?.predecessorDetailId ?? null,
    operationCode: nodeData?.operationCode || '',
    actionType: nodeData?.actionType || '',
    buttonLabel: nodeData?.buttonLabel || '',
    operationVisible: nodeData?.operationVisible || '1'
  })

  // 尝试根据 perms 回显系统菜单选中项
  selectedSysMenuId.value = null
  if (nodeData?.perms && (menuType === 'C' || menuType === 'F')) {
    const matched = findNodeByPerms(sysMenuTreeData.value, nodeData.perms)
    if (matched) {
      selectedSysMenuId.value = matched.menuId
    }
  }

  editDialogVisible.value = true
  nextTick(() => editFormRef.value?.clearValidate())
}

/**
 * 节点类型切换时清空不相关字段
 */
function handleMenuTypeChange(val) {
  selectedSysMenuId.value = null
  if (val === 'M') {
    editForm.tableName = ''
    editForm.operationCode = ''
    editForm.component = ''
    editForm.backendRoute = ''
    editForm.customParams = ''
    editForm.predecessorDetailId = null
    editForm.operationVisible = '1'
  } else if (val === 'C') {
    editForm.operationCode = ''
    editForm.backendRoute = ''
    editForm.operationVisible = '1'
  } else if (val === 'F') {
    editForm.tableName = ''
    editForm.customParams = ''
    editForm.predecessorDetailId = null
    editForm.path = ''
    editForm.component = ''
    editForm.query = ''
    editForm.isFrame = '1'
    editForm.isCache = '0'
    editForm.visible = '0'
    editForm.actionType = ''
  }
}

// ==================== 预览组件 ====================

/**
 * 预览 C 类型节点对应的前端组件
 *
 * 用户在树节点上点击 eye-open 按钮时触发：
 * - 校验 component 是否已配置
 * - 将 previewNode 设为当前节点，右侧 panel 切换到预览模式
 * - 通过 loadPreviewComponent 异步加载组件
 *
 * @param {Object} data 当前 C 类型节点数据（含 menuId、menuName、component 等字段）
 */
function handlePreview(data) {
  if (!data.component) {
    ElMessage.warning('该节点未配置前端组件路径')
    return
  }
  previewNode.value = data
  loadPreviewComponent(data.component)
}

/**
 * 异步加载前端组件
 *
 * 从 modules 映射表中查找组件文件：
 * - component 字段值可能是 "bizdata/biz_receiving/versions/v1.0.0/Form"（不带后缀）
 *   或 "bizdata/biz_receiving/versions/v1.0.0/Form.vue"（带后缀）
 * - 统一补全 .vue 后缀后拼成 /src/views/xxx.vue 作为查找 key
 * - 找到后通过 defineAsyncComponent 包装为异步组件赋值给 previewComponent
 *
 * @param {String} componentPath 组件路径（来自节点 component 字段）
 */
function loadPreviewComponent(componentPath) {
  if (!componentPath) {
    previewComponent.value = null
    return
  }
  // 兼容带/不带 .vue 后缀的配置
  const normalized = componentPath.endsWith('.vue') ? componentPath : componentPath + '.vue'
  const fullPath = '/src/views/' + normalized
  const loader = modules[fullPath]
  if (loader) {
    previewComponent.value = defineAsyncComponent(loader)
  } else {
    previewComponent.value = null
    ElMessage.warning('未找到组件文件：' + fullPath)
  }
}

/**
 * 返回详情视图
 *
 * 清空预览状态，右侧 panel 切回节点详情展示。
 */
function handleBackToDetail() {
  previewNode.value = null
  previewComponent.value = null
}

// ==================== 选择器回调 ====================

/**
 * 打开物理表选择对话框
 *
 * 调用 basic 模块的 SelectTable 组件（原 fill 模块的 SelectForm 已迁移），
 * 通过 ref 触发组件的 show 方法打开对话框。
 * 用户在对话框中选择一条物理表记录后，会通过 @ok 事件回调 onFormSelected。
 */
function openSelectTable() {
  selectTableRef.value.show()
}

/**
 * 物理表选择回调
 *
 * 用户在 SelectTable 对话框中点击"确定"后触发。
 * 回填逻辑：
 * - tableName：物理表名（必填字段，参与表单校验）
 * - menuName：若当前菜单名称为空，则用物理表注释或表名作为默认菜单名称
 *
 * @param {Object} row 选中的物理表记录（含 tableName、tableComment、module、groupName 等字段）
 */
function onFormSelected(row) {
  editForm.tableName = row.tableName
  if (!editForm.menuName) {
    editForm.menuName = row.tableComment || row.tableName
  }
}

/**
 * 打开操作码选择对话框
 *
 * 调用 basic 模块的 SelectOperation 组件，通过 ref 触发组件的 show 方法打开对话框。
 * 用户在对话框中选择一条操作码后，会通过 @ok 事件回调 onOperationSelected。
 */
function openSelectOperation() {
  selectOperationRef.value.show()
}

/**
 * 操作码选择回调
 * 
 * 用户从 SelectOperation 组件选择操作码后，回填以下字段到编辑表单：
 * - operationCode：操作码（外键字段，存储 BasicOperation.code 的值）
 * - actionType：操作类型（用于后端状态机推导）
 * - menuName：菜单名称（优先用操作名称，否则用按钮标签）
 * - component：前端组件路径
 * - backendRoute：后端接口路径
 * - buttonLabel：按钮标签
 * 
 * 重要：不再从操作码回填 perms！
 * 
 * 权限标识的权威来源是 sys_menu.perms。用户必须独立选择"系统按钮权限"
 * （通过下方独立的 el-tree-select 组件），从而保证权限一致性：
 * - 权限标识：设计态从 sys_menu 中选择并快照
 * - 操作码字段：设计态从 basic_operation 中选择，仅用于业务逻辑
 * 
 * @param {Object} row 选中的操作码对象（含 id、code、name、actionType 等字段）
 */
function onOperationSelected(row) {
  editForm.operationCode = row.code
  editForm.actionType = row.actionType || ''
  editForm.menuName = row.name || row.buttonLabel || row.code
  editForm.component = row.component || ''
  editForm.backendRoute = row.backendRoute || ''
  editForm.buttonLabel = row.buttonLabel || ''
}

/**
 * 系统菜单选择回调
 *
 * 用户在 el-tree-select 中选择系统菜单节点后触发，根据当前编辑的节点类型回填相关字段：
 * - C 节点（菜单）：回填菜单名称、路径、组件、权限标识、路由名称、路由参数、是否外链、
 *   是否缓存、显示状态、图标
 * - F 节点（按钮）：回填权限标识（perms），若菜单名称为空则用节点名称补全
 *
 * 注意：F 节点的 perms 只从此处回填，不从操作码回填，保证权限权威来源是 sys_menu。
 *
 * @param {Number} menuId 选中的系统菜单节点 ID
 */
function handleSysMenuSelect(menuId) {
  if (!menuId) return
  const node = findNodeById(sysMenuTreeData.value, menuId)
  if (!node) return
  if (editForm.menuType === 'C') {
    editForm.menuName = node.menuName || editForm.menuName
    editForm.path = node.path || ''
    editForm.component = node.component || ''
    editForm.perms = node.perms || ''
    editForm.routeName = node.routeName || ''
    editForm.query = node.query || ''
    editForm.isFrame = node.isFrame !== undefined ? String(node.isFrame) : editForm.isFrame
    editForm.isCache = node.isCache !== undefined ? String(node.isCache) : editForm.isCache
    editForm.visible = node.visible || '0'
    editForm.icon = node.icon || '#'
  } else if (editForm.menuType === 'F') {
    editForm.perms = node.perms || ''
    if (!editForm.menuName) {
      editForm.menuName = node.menuName || ''
    }
  }
}

// ==================== 删除 ====================
function handleDelete(node) {
  if (node.children && node.children.length > 0) {
    ElMessage.warning('存在子节点，无法删除')
    return
  }
  ElMessageBox.confirm(`确认删除节点「${node.menuName}」？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await delScheme_design_menu(node.menuId)
    ElMessage.success('删除成功')
    if (currentNode.value && currentNode.value.menuId === node.menuId) {
      currentNode.value = null
    }
    if (previewNode.value && previewNode.value.menuId === node.menuId) {
      previewNode.value = null
      previewComponent.value = null
    }
    await loadTree()
  }).catch(() => {})
}

// ==================== 提交 ====================
async function submitEdit() {
  await editFormRef.value.validate()
  const data = { ...editForm }
  data.orderNum = Number(data.orderNum)
  data.isFrame = Number(data.isFrame)
  data.isCache = Number(data.isCache)
  if (data.menuId) {
    await updateScheme_design_menu(data)
    ElMessage.success('修改成功')
  } else {
    await addScheme_design_menu(data)
    ElMessage.success('新增成功')
  }
  editDialogVisible.value = false
  await loadTree()
  if (currentNode.value) {
    const refreshed = findNodeById(treeData.value, currentNode.value.menuId)
    if (refreshed) currentNode.value = refreshed
  }
}

defineExpose({ open, close })
</script>

<style scoped>
/* ============================================================
 * 对话框本体：高度固定 + flex 列布局
 *
 * 关键修正：`.design-config-dialog` 是加在 el-dialog 根元素上的 class，
 * 与 `.el-dialog` 是同一个元素，所以**不能**写成
 * `.design-config-dialog :deep(.el-dialog)`（那会要求 .el-dialog 是后代，永远不匹配）。
 * 直接选择 `.design-config-dialog` 即可。
 *
 * 之前 CSS 未生效导致 dialog 高度 auto → body 被内容撑高 → overflow: hidden 裁掉底部，
 * 预览组件的底部内容被遮挡。此处修正后 dialog 高度固定为 96vh。
 * ============================================================ */
.design-config-dialog {
  display: flex;
  flex-direction: column;
  height: 96vh;
  margin: 2vh auto;
}

/* 全屏模式下 el-dialog 会自己处理高度（100vh），这里只需确保仍是 flex 列布局 */
.design-config-dialog.is-fullscreen {
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0;
}

/* dialog header：固定高度，不参与弹性伸缩 */
.design-config-dialog :deep(.el-dialog__header) {
  flex-shrink: 0;
  padding: 16px 20px;
  margin-right: 0;
  border-bottom: 1px solid #e4e7ed;
}

/* dialog body：撑满剩余高度，内部单独滚动 */
.design-config-dialog :deep(.el-dialog__body) {
  flex: 1;
  min-height: 0;
  padding: 12px;
  overflow: hidden;
}

/* ============================================================
 * 自定义对话框标题栏
 * 左侧：标题（设计态配置 [方案名称|方案编码]）
 * 右侧：全屏按钮（切换 el-dialog 的 fullscreen 属性）
 * ============================================================ */
.design-config-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* 为 el-dialog 默认的关闭按钮留出右侧空间 */
  padding-right: 28px;
}

.design-config-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 全屏图标：与若依 Navbar 的全屏图标样式保持一致 */
.design-config-fullscreen-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  fill: #5a5e66;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.design-config-fullscreen-icon:hover {
  fill: #409eff;
  transform: scale(1.1);
}

/* ============================================================
 * 内部 el-row / el-col 撑满 body 高度
 * 让左侧树面板与右侧详情面板等高，由 flex 列布局分配内部空间。
 * 使用自定义 class `design-config-body-row` 避免误伤内部编辑对话框的 el-row。
 * ============================================================ */
.design-config-dialog :deep(.design-config-body-row) {
  height: 100%;
}

.design-config-dialog :deep(.design-config-body-row > .el-col) {
  height: 100%;
}

/* ============================================================
 * 左右面板：卡片风格 + flex 列布局
 * - panel-header 固定高度
 * - tree-body / detail-body 使用 flex:1 撑满剩余空间，各自独立滚动
 * ============================================================ */
.tree-panel,
.detail-panel {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  background: #f5f7fa;
  padding: 10px 16px;
  font-weight: 600;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

/* 左侧 panel-header 中的操作按钮区：折叠 + 新增根目录 */
.panel-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 左侧树内容区：flex 撑满，独立纵向滚动 */
.tree-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  min-height: 0;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  width: 100%;
}

.node-icon {
  font-size: 16px;
  color: #909399;
  flex-shrink: 0;
}

.node-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.node-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.2s;
}

.tree-node:hover .node-actions {
  opacity: 1;
}

/* eye-open 图标尺寸：让 svg-icon 与 Element Plus 图标视觉对齐 */
.action-icon {
  width: 14px;
  height: 14px;
  vertical-align: middle;
}

/* 右侧详情内容区：flex 撑满，独立纵向滚动 */
.detail-body {
  flex: 1;
  padding: 0px;
  overflow-y: auto;
  min-height: 0;
}

.detail-actions {
  margin-top: 16px;
  text-align: right;
}

/* ============================================================
 * 组件预览容器
 *
 * 不再设置 min-height / overflow，避免嵌套滚动容器
 * 与 .detail-body 的滚动条互相干扰，导致预览组件底部被裁剪。
 * 让预览组件的内部内容自然撑高，统一由外层 .detail-body 承担滚动。
 * ============================================================ */
.component-preview {
  width: 100%;
}
</style>