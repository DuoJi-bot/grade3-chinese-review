/**
 * 文字转语音(TTS)模块
 * 使用 Web Speech API 实现中文朗读功能
 */
class TTSManager {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voice = null;
        this.speaking = false;
        this.queue = [];
        
        // 初始化时获取中文语音
        this.initVoice();
    }
    
    /**
     * 初始化中文语音
     */
    initVoice() {
        // 等待语音列表加载
        if (this.synth.getVoices().length === 0) {
            this.synth.addEventListener('voiceschanged', () => {
                this.selectChineseVoice();
            });
        } else {
            this.selectChineseVoice();
        }
    }
    
    /**
     * 选择中文语音
     */
    selectChineseVoice() {
        const voices = this.synth.getVoices();
        
        // 优先选择中文语音
        const chineseVoices = voices.filter(v => 
            v.lang.includes('zh') || 
            v.lang.includes('cmn') ||
            v.name.includes('Chinese') ||
            v.name.includes('中文')
        );
        
        if (chineseVoices.length > 0) {
            // 优先选择普通话
            this.voice = chineseVoices.find(v => 
                v.lang === 'zh-CN' || 
                v.lang === 'cmn-CN' ||
                v.name.includes('Mandarin')
            ) || chineseVoices[0];
        }
        
        console.log('TTS 语音已就绪:', this.voice?.name || '默认语音');
    }
    
    /**
     * 朗读文本
     * @param {string} text - 要朗读的文本
     * @param {Object} options - 配置选项
     * @param {number} options.rate - 语速 (0.1 - 10, 默认 0.9)
     * @param {number} options.pitch - 音调 (0 - 2, 默认 1)
     * @param {number} options.volume - 音量 (0 - 1, 默认 1)
     * @param {Function} options.onEnd - 朗读结束回调
     * @param {Function} options.onError - 错误回调
     */
    speak(text, options = {}) {
        if (!text || !text.trim()) return;
        
        // 停止当前朗读
        this.stop();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // 设置语音
        if (this.voice) {
            utterance.voice = this.voice;
        }
        
        // 设置语言
        utterance.lang = 'zh-CN';
        
        // 设置参数
        utterance.rate = options.rate ?? 0.9;
        utterance.pitch = options.pitch ?? 1;
        utterance.volume = options.volume ?? 1;
        
        // 事件处理
        utterance.onstart = () => {
            this.speaking = true;
        };
        
        utterance.onend = () => {
            this.speaking = false;
            if (options.onEnd) {
                options.onEnd();
            }
        };
        
        utterance.onerror = (event) => {
            this.speaking = false;
            console.error('TTS 错误:', event.error);
            if (options.onError) {
                options.onError(event.error);
            }
        };
        
        // 开始朗读
        this.synth.speak(utterance);
    }
    
    /**
     * 逐字朗读
     * @param {string} text - 要朗读的文本
     * @param {number} delay - 每个字的间隔时间(ms)
     * @param {Function} onCharSpeak - 每个字朗读时的回调
     */
    speakCharByChar(text, delay = 500, onCharSpeak = null) {
        const chars = text.split('');
        let index = 0;
        
        const speakNext = () => {
            if (index >= chars.length) return;
            
            const char = chars[index];
            
            if (onCharSpeak) {
                onCharSpeak(char, index);
            }
            
            this.speak(char, {
                rate: 0.8,
                onEnd: () => {
                    index++;
                    if (index < chars.length) {
                        setTimeout(speakNext, delay);
                    }
                }
            });
        };
        
        speakNext();
    }
    
    /**
     * 停止朗读
     */
    stop() {
        if (this.synth.speaking) {
            this.synth.cancel();
        }
        this.speaking = false;
    }
    
    /**
     * 暂停朗读
     */
    pause() {
        if (this.synth.speaking) {
            this.synth.pause();
        }
    }
    
    /**
     * 恢复朗读
     */
    resume() {
        if (this.synth.paused) {
            this.synth.resume();
        }
    }
    
    /**
     * 检查是否正在朗读
     */
    isSpeaking() {
        return this.synth.speaking;
    }
    
    /**
     * 检查 TTS 是否可用
     */
    isAvailable() {
        return 'speechSynthesis' in window;
    }
}

// 创建全局 TTS 实例
window.tts = new TTSManager();
