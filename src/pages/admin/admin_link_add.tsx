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

import {useSelector} from "react-redux";
import { SystemInfoEntity } from "../../models/entity/system_info_entity";

import {useEffect, useState} from "react";
import {Button, Divider, Input, Select, Textarea} from "@fluentui/react-components";

export function AdminLinkAdd({headerEmit, menuEmit}: Readonly<{
    headerEmit: (data: string) => void,
    menuEmit: (data: string) => void
}>) {
    const webInfoStore = useSelector((state: { webInfo: SystemInfoEntity }) => state.webInfo);

    const [formData, setFormData] = useState({
        email: "",
        serviceProvider: "",
        siteName: "",
        siteUrl: "",
        siteLogo: "",
        siteRss: "",
        siteDescription: "",
        location: "",
        color: "",
        hasAdv: "否",
        remark: "",
    });

    document.title = `添加友链 | ${webInfoStore.site.site_name}`;

    useEffect(() => {
        headerEmit("添加友链");
        menuEmit("link");
    }, [headerEmit, menuEmit]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        console.log("提交表单数据：", formData);
        // 提交逻辑
    };

    const handleCancel = () => {
        console.log("取消修改");
        // 取消逻辑
    };

    return (
        <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 lg:col-span-9 grid grid-cols-12 gap-4">
                <div className="col-span-12">
                    <Divider>站点配置</Divider>
                </div>
                <div className="col-span-6">
                    <Input
                        placeholder="请输入站长邮箱"
                        value={formData.email}
                        onChange={(_, data) => handleChange("email", data.value)}
                    />
                </div>
                <div className="col-span-6">
                    <Input
                        placeholder="请输入服务提供商"
                        value={formData.serviceProvider}
                        onChange={(_, data) => handleChange("serviceProvider", data.value)}
                    />
                </div>

                {/* 站点信息 */}
                <div className="col-span-12 mt-4">
                    <Divider>站点信息</Divider>
                </div>
                <div className="col-span-6">
                    <Input
                        placeholder="请输入站点名字"
                        required
                        value={formData.siteName}
                        onChange={(_, data) => handleChange("siteName", data.value)}
                    />
                </div>
                <div className="col-span-6">
                    <Input
                        placeholder="请输入站点地址"
                        required
                        value={formData.siteUrl}
                        onChange={(_, data) => handleChange("siteUrl", data.value)}
                    />
                </div>
                <div className="col-span-6">
                    <Input
                        placeholder="请输入图标地址"
                        value={formData.siteLogo}
                        onChange={(_, data) => handleChange("siteLogo", data.value)}
                    />
                </div>
                <div className="col-span-6">
                    <Input
                        placeholder="请输入订阅地址"
                        value={formData.siteRss}
                        onChange={(_, data) => handleChange("siteRss", data.value)}
                    />
                </div>
                <div className="col-span-12">
                    <Textarea
                        placeholder="请输入站点描述"
                        value={formData.siteDescription}
                        onChange={(_, data) => handleChange("siteDescription", data.value)}
                    />
                </div>

                {/* 位置管理 */}
                <div className="col-span-12 mt-4">
                    <Divider>位置管理</Divider>
                </div>
                <div className="col-span-6">
                    <Select
                        required
                        value={formData.location}
                        onChange={(_, data) => handleChange("location", data.value)}
                    >
                        <option value="">请选择位置</option>
                        <option value="1">顶部</option>
                        <option value="2">侧边栏</option>
                        <option value="3">底部</option>
                    </Select>
                </div>
                <div className="col-span-6">
                    <Select
                        required
                        value={formData.color}
                        onChange={(_, data) => handleChange("color", data.value)}
                    >
                        <option value="">请选择颜色</option>
                        <option value="1">红色</option>
                        <option value="2">蓝色</option>
                        <option value="3">绿色</option>
                    </Select>
                </div>
                <div className="col-span-6">
                    <Select
                        required
                        value={formData.hasAdv}
                        onChange={(_, data) => handleChange("hasAdv", data.value)}
                    >
                        <option value="否">否</option>
                        <option value="是">是</option>
                    </Select>
                </div>

                <div className="col-span-12 mt-4">
                    <Divider>其他信息</Divider>
                </div>
                <div className="col-span-12">
                    <Textarea
                        placeholder="请输入备注信息"
                        value={formData.remark}
                        onChange={(_, data) => handleChange("remark", data.value)}
                    />
                </div>
            </div>

            <div className="col-span-12 lg:col-span-3 flex flex-col justify-start items-stretch gap-4">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="text-lg font-bold mb-2">操作</div>
                    <Button
                        appearance="outline"
                        onClick={handleCancel}
                    >
                        取消修改
                    </Button>
                    <Button
                        appearance="primary"
                        onClick={handleSubmit}
                    >
                        确认修改
                    </Button>
                </div>
            </div>
        </div>
    );
}
