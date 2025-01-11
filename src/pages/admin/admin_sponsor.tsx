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
import {SystemInfoEntity} from "../../models/entity/system_info_entity.ts";
import {Card, CardFooter, CardHeader, CardPreview, Toolbar, ToolbarButton} from "@fluentui/react-components";
import {LinkFilled} from "@fluentui/react-icons";
import {useNavigate} from "react-router";
import {useEffect} from "react";
import defaultBackground from "../../assets/images/default-background.webp";
import {animated, useSprings} from "@react-spring/web";

export function AdminSponsor({headerEmit, menuEmit}: Readonly<{
    headerEmit: (data: string) => void,
    menuEmit: (data: string) => void
}>) {
    const navigate = useNavigate();
    const webInfoStore = useSelector((state: { webInfo: SystemInfoEntity }) => state.webInfo);

    document.title = `赞助 | ${webInfoStore.site.site_name}`;

    useEffect(() => {
        headerEmit("赞助");
        menuEmit("sponsor");
    }, [headerEmit, menuEmit]);

    const [springs] = useSprings(2, (index: number) => ({
        opacity: 1,
        transform: "translateY(0)",
        from: {opacity: 0, transform: "translateY(20px)"},
        delay: index * 50,
        config: {tension: 170, friction: 26},
    }));

    return (
        <div className={"grid grid-cols-12 gap-3 border-t"}>
            <div className={"col-span-full border-b py-1"}>
                <Toolbar>
                    <ToolbarButton appearance={"primary"} icon={<LinkFilled fontSize={24}/>}
                                   onClick={() => navigate("/admin/link/add")}>
                        添加赞助
                    </ToolbarButton>
                </Toolbar>
            </div>
            <div className={"col-span-full lg:col-span-9 grid"}>
                2345678
            </div>
            <animated.div className={"lg:col-span-3 hidden lg:block"} style={springs[0]}>
                <Card className={"m-auto w-full shadow-md rounded-lg bg-white"}>
                    <CardPreview>
                        <img
                            className="object-cover w-full h-36"
                            src={defaultBackground}
                            alt="背景图"
                        />
                    </CardPreview>
                    <CardHeader
                        header={<div className="text-xl font-bold text-gray-800">赞助信息</div>}
                        description={<div className="text-sm text-gray-500">赞助统计信息</div>}
                    />
                    <CardFooter>
                        <div className={"grid gap-3 px-4 py-3"}>
                            s
                        </div>
                    </CardFooter>
                </Card>
            </animated.div>
        </div>
    );
}
