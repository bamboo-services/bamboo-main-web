/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2016-NOW(至今) 筱锋
 * Author: 筱锋(https://www.x-lf.com)
 *
 * 本文件包含 XiaoMain 的源代码，该项目的所有源代码均遵循MIT开源许可证协议。
 * --------------------------------------------------------------------------------
 * 许可证声明：
 *
 * 版权所有 (c) 2016-2024 筱锋。保留所有权利。
 *
 * 本软件是“按原样”提供的，没有任何形式的明示或暗示的保证，包括但不限于
 * 对适销性、特定用途的适用性和非侵权性的暗示保证。在任何情况下，
 * 作者或版权持有人均不承担因软件或软件的使用或其他交易而产生的、
 * 由此引起的或以任何方式与此软件有关的任何索赔、损害或其他责任。
 *
 * 使用本软件即表示您了解此声明并同意其条款。
 *
 * 有关MIT许可证的更多信息，请查看项目根目录下的LICENSE文件或访问：
 * https://opensource.org/licenses/MIT
 * --------------------------------------------------------------------------------
 * 免责声明：
 *
 * 使用本软件的风险由用户自担。作者或版权持有人在法律允许的最大范围内，
 * 对因使用本软件内容而导致的任何直接或间接的损失不承担任何责任。
 * --------------------------------------------------------------------------------
 */

import { createSlice } from "@reduxjs/toolkit";
import { SystemInfoEntity } from "../models/entity/system_info_entity.ts";

/**
 * # webInfoStore
 *
 * 定义 webInfoStore，用于管理网站信息和博主信息的状态。
 * webInfoStore 包含设置网站信息的方法。
 */
export const webInfoStore = createSlice({
    name: "webInfo",
    initialState: {
        site: {},
        blogger: {}
    } as SystemInfoEntity,
    reducers: {
        /**
         * 设置网站和博主信息。
         * @param state - 当前的 webInfoStore 状态。
         * @param action - 包含网站信息和博主信息的 action。
         *   - site: 网站信息，包含站点的名称、作者、版本等。
         *   - blogger: 博主信息，包含博主的姓名、昵称、邮箱等。
         */
        setWebInfo: (state, action) => {
            state.site = action.payload.site; // 更新网站信息
            state.blogger = action.payload.blogger; // 更新博主信息
        }
    }
});

// 导出 action，用于组件中 dispatch 调用
export const { setWebInfo } = webInfoStore.actions;

