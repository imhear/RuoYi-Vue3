#!/bin/bash

# =============================================================================
# 若依前端二开同步脚本（安全版）
# 功能：检查官方仓库（upstream）是否有新提交，若有则同步到本地二开主分支（custom-main）
# 前提：已配置 remote 名称为 upstream（官方）和 origin（个人）
#       已创建分支 upstream-stable（官方纯净镜像分支）
# 用法：在项目根目录执行 bash scripts/sync.sh
# 注意：脚本执行过程中如遇冲突，请手动解决后重新运行脚本或手动完成合并
# =============================================================================

echo "切换到二开主分支 custom-main"
git checkout custom-main

echo "拉取官方最新分支信息"
git fetch upstream

if git merge-base --is-ancestor upstream/master custom-main; then
    echo "✅ 官方无最新更新，custom-main 已包含所有官方提交，可直接开发"
else
    echo "🔔 检测到官方有新提交，开始同步..."
    
    echo "更新纯净镜像分支 upstream-stable 到官方 master"
    git checkout upstream-stable
    git reset --hard upstream/master
    git push origin upstream-stable --force-with-lease
    
    echo "合并官方更新到 custom-main"
    git checkout custom-main
    git merge upstream-stable
    
    if [ $? -ne 0 ]; then
        echo "⚠️ 合并发生冲突，请手动解决冲突后提交，然后执行 git push origin custom-main"
        exit 1
    fi
    
    echo "✅ 官方更新已同步到 custom-main"
fi

echo "拉取个人远程仓库最新代码（团队协作时使用）"
git pull origin custom-main

echo "🎉 脚本执行完毕，当前分支：$(git branch --show-current)"
