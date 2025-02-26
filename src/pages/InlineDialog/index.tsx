import React, { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Modal, Space } from "antd";
import InlineInput from '../../components/InlineDialog';
import './inlineDialog.scss'


const InlineDialog: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);


    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {/* 右上角搜索框 */}
            <div className="inline-dialog">
                <Space direction="vertical" size="middle">
                    <Space.Compact size="large">
                        <Input
                            addonBefore={<SearchOutlined />}
                            onClick={handleOpenModal}
                            placeholder="搜索..."
                            style={{ width: '100%', maxWidth: '500px' }}
                        />
                    </Space.Compact>
                </Space>
            </div>

            {/* 居中弹出层 */}
            <Modal
                open={isModalOpen}
                onCancel={handleCloseModal} // 点击灰色区域关闭
                footer={null} // 不需要底部按钮
                centered // 让弹窗居中
                maskClosable={true} // 点击遮罩层可关闭
                width={600} // 设置宽度
                style={{ maxHeight: '80vh', overflowY: 'auto' }} // 设置最大高度，且超出部分滚动
            >
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <InlineInput />
                </div>
            </Modal>
        </>
    );
};

export default InlineDialog;
