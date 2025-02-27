// tests/components/ChatComponent.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatComponent from '../../src/components/ChatComponent';
import useCozeChat from '../../src/hooks/useCozeChat';

// Mock 自定义 hook
jest.mock('../../src/hooks/useCozeChat');

const mockUseCozeChat = useCozeChat as jest.MockedFunction<typeof useCozeChat>;

describe('ChatComponent', () => {
  // 基础 mock 数据
  const baseMock = {
    messages: [],
    loading: false,
    error: null,
    sendMessage: jest.fn(),
    conversationId: 'test-conversation-123'
  };

  beforeEach(() => {
    mockUseCozeChat.mockReturnValue(baseMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // 测试初始渲染
  test('1. 初始渲染显示基本元素', () => {
    render(<ChatComponent />);
    
    expect(screen.getByPlaceholderText('输入消息...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '发送' })).toBeInTheDocument();
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  // 测试消息发送
  test('2. 发送消息流程', async () => {
    const user = userEvent.setup();
    render(<ChatComponent />);

    const input = screen.getByPlaceholderText('输入消息...');
    const button = screen.getByRole('button', { name: '发送' });

    // 输入并发送消息
    await user.type(input, 'Hello world');
    await user.click(button);

    // 验证输入框清空
    expect(input).toHaveValue('');
    // 验证发送方法调用
    expect(baseMock.sendMessage).toHaveBeenCalledWith(
      'Hello world',
      '7475704281941884968'
    );
  });

  // 测试加载状态
  test('3. 显示加载状态', () => {
    mockUseCozeChat.mockReturnValue({
      ...baseMock,
      loading: true
    });

    render(<ChatComponent />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('发送中...');
  });

  // 测试错误显示
  test('4. 显示错误信息', () => {
    const errorMsg = '网络连接错误';
    mockUseCozeChat.mockReturnValue({
      ...baseMock,
      error: errorMsg
    });

    render(<ChatComponent />);
    
    const error = screen.getByText(errorMsg);
    expect(error).toBeInTheDocument();
    expect(error).toHaveStyle('color: red');
  });

  // 测试消息列表渲染
  test('5. 正确渲染消息列表', () => {
    const testMessages = [
      { role: 'user', content: '你好' },
      { role: 'bot', content: '你好！有什么可以帮助你？' }
    ];

    mockUseCozeChat.mockReturnValue({
      ...baseMock,
      messages: testMessages
    });

    render(<ChatComponent />);
    
    const messageElements = screen.getAllByRole('listitem');
    expect(messageElements).toHaveLength(2);
    
    // 验证第一条消息
    expect(messageElements[0]).toHaveTextContent('user: 你好');
    expect(messageElements[0]).toHaveTextContent('conversationId:test-conversation-123');
    
    // 验证第二条消息
    expect(messageElements[1]).toHaveTextContent('bot: 你好！有什么可以帮助你？');
  });
});