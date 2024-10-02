// screens/InboxScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const InboxScreen = () => {
  const route = useRoute();
  const { driverId, driverName, driverImage } = route.params || {};

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);
  const insets = useSafeAreaInsets(); // Sử dụng hook để lấy safe area insets

  // Mock initial messages (có thể thay thế bằng dữ liệu thực tế từ backend)
  useEffect(() => {
    const now = new Date();

    const initialMessages = [
      {
        id: '1',
        text: 'Chào bạn! Tôi là tài xế của bạn.',
        sender: 'driver',
        timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ];
    setMessages(initialMessages);
  }, []);  

  // Dữ liệu phản hồi tự động
  const predefinedResponses = {
    'Làm ơn gọi lại cho tôi': 'Tất nhiên, tôi sẽ gọi lại cho bạn ngay.',
    'Hello': 'Xin chào! Bạn cần hỗ trợ gì?',
    'Cảm ơn': 'Không có gì, tôi luôn sẵn sàng giúp đỡ bạn!',
    'Tôi cần hỗ trợ về đơn hàng': 'Bạn vui lòng cung cấp mã đơn hàng để tôi kiểm tra.',
  };

  // Dữ liệu gợi ý tin nhắn
  const messageSuggestions = [
    'Làm ơn gọi lại cho tôi',
    'Hello',
    'Cảm ơn',
    'Tôi cần hỗ trợ về đơn hàng',
    // Thêm các gợi ý khác ở đây
  ];

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: (messages.length + 1).toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    Keyboard.dismiss();

    // Cuộn đến cuối danh sách tin nhắn sau khi gửi
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
    
    // Kiểm tra và gửi phản hồi tự động nếu có
    if (predefinedResponses[inputText.trim()]) {
      const botResponse = {
        id: (messages.length + 2).toString(),
        text: predefinedResponses[inputText.trim()],
        sender: 'driver',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, botResponse]);
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 1000); // Thời gian trễ để giả lập phản hồi từ tài xế
    }

    // Ở đây bạn có thể thêm logic để gửi tin nhắn đến backend hoặc tài xế
  };

  const handleVideoCall = () => {
    // Thêm logic để gọi video (có thể sử dụng các thư viện như react-native-webrtc hoặc tích hợp với dịch vụ khác)
    alert('Gọi video');
  };

  const handleVoiceCall = () => {
    // Thêm logic để gọi điện thoại
    alert('Gọi điện thoại');
  };

  const handleSuggestionPress = (suggestion) => {
    setInputText(suggestion);
    // Gọi handleSend sau khi đặt inputText
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  const renderMessageItem = ({ item }) => {
    const isDriver = item.sender === 'driver';
    return (
      <View
        style={[
          styles.messageContainer,
          isDriver ? styles.driverMessage : styles.userMessage,
        ]}
      >
        {isDriver && (
          <Image source={{ uri: driverImage || 'https://via.placeholder.com/40' }} style={styles.messageAvatar} />
        )}
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.messageTimestamp}>{item.timestamp}</Text>
        </View>
        {!isDriver && (
          <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.messageAvatar} />
        )}
      </View>
    );
  };

  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionButton}
      onPress={() => handleSuggestionPress(item)}
    >
      <Text style={styles.suggestionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={insets.bottom - 50} // Điều chỉnh offset dựa trên chiều cao của thanh tab
    >
      {/* Phần trên: Ảnh, tên và các nút gọi */}
      <View style={styles.header}>
        <Image
          source={{ uri: driverImage || 'https://via.placeholder.com/60' }}
          style={styles.driverImage}
        />
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{driverName || 'Tài xế'}</Text>
        </View>
        <View style={styles.callButtons}>
          <TouchableOpacity style={styles.callButton} onPress={handleVideoCall}>
            <Ionicons name="videocam" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.callButton} onPress={handleVoiceCall}>
            <Ionicons name="call" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Phần giữa: Danh sách tin nhắn */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      />

      {/* Phần gợi ý tin nhắn */}
      <View style={styles.suggestionsContainer}>
        <FlatList
          data={messageSuggestions}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderSuggestionItem}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Phần dưới: Thanh nhập tin nhắn */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default InboxScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 55,
  },
  driverImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
  },
  driverInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  callButtons: {
    flexDirection: 'row',
  },
  callButton: {
    width: 40,
    height: 40,
    backgroundColor: '#2196f3',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  messagesList: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  driverMessage: {
    justifyContent: 'flex-start',
  },
  userMessage: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  messageAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    marginHorizontal: 8,
  },
  messageText: {
    fontSize: 16,
    color: '#333333',
  },
  messageTimestamp: {
    fontSize: 12,
    color: '#999999',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  suggestionsContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  suggestionButton: {
    backgroundColor: '#e0f7fa',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  suggestionText: {
    color: '#00796b',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    fontSize: 16,
    marginRight: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: '#2196f3',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
