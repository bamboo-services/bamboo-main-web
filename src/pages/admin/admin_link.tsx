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

import {useDispatch, useSelector} from "react-redux";
import {SystemInfoEntity} from "../../models/entity/system_info_entity.ts";
import {useEffect, useState} from "react";
import {
    Button,
    Caption1,
    Card,
    CardFooter,
    CardHeader,
    CardPreview,
    Text,
    Toolbar,
    ToolbarButton,
    ToolbarDivider
} from "@fluentui/react-components";
import {LinkDismissFilled, LinkFilled, PenRegular, TabGroupRegular} from "@fluentui/react-icons";
import defaultBackground from "../../assets/images/default-background.webp";
import {AdminGetLinkAPI} from "../../apis/api_link.ts";
import {setToaster} from "../../stores/toaster_store.ts";
import {ToastStore} from "../../models/store/toast_stores.ts";
import {LinkGetAdminEntity} from "../../models/entity/link_get_admin_entity.ts";

import noAvatar from "../../assets/images/no_avatar.png";
import {animated, useSprings} from "@react-spring/web";

export function AdminLink({headerEmit, menuEmit}: Readonly<{
    headerEmit: (data: string) => void,
    menuEmit: (data: string) => void
}>) {
    const dispatch = useDispatch();

    const webInfo = useSelector((state: { webInfo: SystemInfoEntity }) => state.webInfo);

    const [adminLinkList, setAdminLinkList] = useState<LinkGetAdminEntity>({total: 0} as LinkGetAdminEntity);

    document.title = `友链 | ${webInfo.site.site_name}`

    useEffect(() => {
        headerEmit("友链");
        menuEmit("link");
    }, [headerEmit, menuEmit]);

    useEffect(() => {
        const func = async () => {
            const getResp = await AdminGetLinkAPI();
            if (getResp?.output === "Success") {
                setAdminLinkList(getResp.data!);
            } else {
                dispatch(setToaster({
                    title: getResp?.message,
                    message: getResp?.error_message,
                    type: "error"
                } as ToastStore));
            }
        }
        func().then();
    }, [dispatch]);

    const [springs] = useSprings(adminLinkList.total + 1, (index: number) => ({
        opacity: 1,
        transform: "translateY(0)",
        from: {opacity: 0, transform: "translateY(20px)"},
        delay: index * 50,
        config: {tension: 170, friction: 26},
    }));

    return (
        <div className={"grid grid-cols-12 gap-3 border-t"}>
            <div className={"col-span-full border-b py-1"}>
                <Toolbar className={"flex gap-1"}>
                    <ToolbarButton appearance={"primary"}
                                   icon={<LinkFilled fontSize={24}/>}>
                        添加友链
                    </ToolbarButton>
                    <ToolbarButton appearance={"subtle"}
                                   icon={<TabGroupRegular fontSize={24}/>}>
                        友链组管理
                    </ToolbarButton>
                    <ToolbarDivider/>
                    <ToolbarButton appearance={"subtle"}
                                   icon={<LinkDismissFilled fontSize={24}/>}>
                        检查失效友链
                    </ToolbarButton>
                </Toolbar>
            </div>
            <div className={"col-span-9"}>
                <div className={"grid grid-cols-2 gap-3"}>
                    {adminLinkList.total !== 0 ? adminLinkList?.links?.map((data, index) => (
                        <animated.div style={springs[index + 1]} key={data.id}>
                            <Card key={data.id} className="max-w-full shadow-lg transition hover:bg-gray-100/75">
                                <CardHeader
                                    image={
                                        <img
                                            className="rounded-md min-w-10"
                                            src={data.site_logo}
                                            alt={data.id.toString()}
                                            onError={(e) => {
                                                e.currentTarget.src = noAvatar;
                                                e.currentTarget.onerror = null;
                                            }}
                                        />
                                    }
                                    header={<Text weight="semibold">{data.site_name}</Text>}
                                    description={<Caption1>{data.webmaster_email || "NULL"}</Caption1>}
                                    action={
                                        <Button
                                            appearance="transparent"
                                            icon={<PenRegular fontSize={24}/>}
                                            aria-label="Edit"
                                        />
                                    }
                                />
                                <p className="m-0 line-clamp-2">
                                    {data.site_description || "这个站长很懒，没有写对应的描述内容......"}
                                </p>
                            </Card>
                        </animated.div>
                    )) : "暂时没有友链呢"}
                </div>
            </div>
            <animated.div className={"col-span-3"} style={springs[0]}>
                <Card className={"m-auto w-full shadow-md"}>
                    <CardPreview>
                        <img
                            src={defaultBackground}
                            alt="Preview of a Word document: About Us - Overview"
                        />
                    </CardPreview>
                    <CardFooter className={"grid"}>
                        <div className={"text-lg font-bold"}>友链信息</div>
                    </CardFooter>
                </Card>
            </animated.div>
        </div>
    );
}
