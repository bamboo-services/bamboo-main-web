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

import {createSlice} from "@reduxjs/toolkit";
import {ToastStore} from "../models/store/toast_stores.ts";

/**
 * # toasterStore
 *
 * 定义 toasterStore，用于管理 toaster 的状态和行为。
 * toasterStore 包含设置、关闭和清除 toaster 的功能。
 */
export const toasterStore = createSlice({
    name: "toaster",
    initialState: {
        toastId: "toaster",
        title: "",
        type: "info",
        show: false,
    } as ToastStore,
    reducers: {
        /**
         * 设置 toaster 的消息内容、类型、标题，并显示 toaster。
         * @param state - 当前的 toaster 状态。
         * @param action - 包含要设置的消息内容、类型和标题的 action。
         */
        setToaster: (state, action) => {
            state.message = action.payload.message;
            state.type = action.payload.type;
            state.title = action.payload.title;
            state.show = true;
        },
        /**
         * 关闭 toaster，但保留其内容。
         * @param state - 当前的 toaster 状态。
         */
        closeToaster: (state) => {
            state.show = false;
        },
        /**
         * 清除 toaster 的所有内容，并重置为初始状态。
         * @param state - 当前的 toaster 状态。
         */
        clearToaster: (state) => {
            state.title = "";
            state.message = "";
            state.type = "info";
            state.show = false;
        }
    }
});

export const {setToaster, closeToaster, clearToaster} = toasterStore.actions;
