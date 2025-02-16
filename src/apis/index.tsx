import { useUserStore } from '../store';

interface chatAPIParams {
  conversationId: string;
  message: string;
  files: Array<{
    id: string;
    name: string;
    type: 'file' | 'image' | 'unknown';
    file_id: string | null;
    status: 'uploading' | 'success' | 'error';
  }>;
}

interface uploadFileAPIParams {
  file: File;
}

interface EventStreamData {
  event: string;
  data: Record<string, any>;
}

// 解析流式数据，有些事件可能会有bug
function parseEventStream(input: string): EventStreamData[] {
  const lines = input.split('\n');
  const eventData: EventStreamData[] = [];
  let currentEvent: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.indexOf('event:') === 0) {
      currentEvent = line.slice(6).trim();
    } else if (line.indexOf('data:') === 0 && currentEvent) {
      try {
        const dataStr = line.slice(5).trim();
        const data = JSON.parse(dataStr);
        eventData.push({ event: currentEvent, data });
        currentEvent = null; // 重置当前事件
      } catch (e) {
        console.error('JSON 解析错误:', e, 'input:', line);
        currentEvent = null;
      }
    }
  }
  return eventData;
}

// Axios 不能直接返回流式数据（像浏览器中的 ReadableStream）。
// 使用 fetch 进行流式响应的处理。
export async function chatAPI({ conversationId, message, files }: chatAPIParams) {
  const { cozeToken, botId, userName } = useUserStore.getState();
  const params = conversationId ? `?conversation_id=${conversationId}` : '';

  let additionalMessages;
  if (files.length === 0) {
    additionalMessages = [
      {
        role: "user",
        content: message,
        content_type: "text",
      }
    ];
  } else {
    const messageObject = [
      {
        type: "text",
        text: message
      },
      ...files.map(file => ({
        type: file.type,
        file_id: file.file_id
      }))
    ];
    additionalMessages = [
      {
        role: 'user',
        content: JSON.stringify(messageObject),
        content_type: 'object_string',
      }
    ];
  }

  const response = await fetch(`https://api.coze.cn/v3/chat${params}`, {
    method: 'post',
    headers: {
      "Authorization": `Bearer ${cozeToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      stream: true,
      bot_id: botId,
      user_id: userName,
      additional_messages: additionalMessages
    })
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  if (!response.body) {
    throw new Error('Response body is null');
  }
  const reader = response.body.getReader();  // 获取可读流
  const decoder = new TextDecoder('utf-8');  // 解码流
  let done = false;
  let buffer = '';  // 用于存储流数据
  let answer = '';  // 用于存储回复

  // 逐步读取流，处理流式数据
  while (!done) {
    const { value, done: isDone } = await reader.read();
    done = isDone;
    
    if (value) {
      let decodeValue = decoder.decode(value, { stream: true });
      buffer += decodeValue;
      // 可以打印 decodeValue 查看流数据
      console.log(decodeValue);
      try {
        const parsedData = parseEventStream(decodeValue);

        if (parsedData) {
          const eventData = parsedData;
          for (let i = 0; i < eventData.length; i++) {
            if (eventData[i].event === 'conversation.message.delta') {
              answer += eventData[i].data.content;
            }
            // 处理其他事件，有一些联想问题，可通过 event:conversation.message.completed 和 "type":"follow_up" 判断
          }
        }
      } catch (error) {
        // Continue accumulating buffer if parsing fails
      }
    }
    // 此answer为持续更新的回复
    console.log(answer);
  }

  return buffer;  // 返回流处理后的结果
}

export async function uploadFileAPI({ file }: uploadFileAPIParams) {
  const { cozeToken } = useUserStore.getState();
  const formData = new FormData();
  formData.append('file', file); // 将文件添加到 FormData 对象

  const response = await fetch('https://api.coze.cn/v1/files/upload', {
    method: 'post',
    headers: {
      "Authorization": `Bearer ${cozeToken}`, // 使用 Bearer Token
    },
    body: formData, // 传递 FormData 数据
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
}