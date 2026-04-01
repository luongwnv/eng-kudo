# eng-kudo

Một ứng dụng học tiếng Anh hiện đại, tương tác và hiệu quả. Kết hợp giữa flashcards, trò chơi ngôn ngữ và theo dõi tiến độ để giúp bạn học tiếng Anh một cách vui vẻ và bền vững.

## Tính Năng

### Flashcards
- Học 95+ từ vựng, cụm từ và slang tiếng Anh
- Thẻ ghi nhớ tương tác với phát âm IPA
- Lọc theo trạng thái: Chưa học, Đã học, Yêu thích
- Chế độ xáo trộn (shuffle) để học hiệu quả

### Các Chế Độ Học
1. **Flashcards**: Học từ vựng cơ bản với ví dụ tiếng Anh/Việt
2. **Vocabulary**: 
   - 3 cấp độ: Beginner, Intermediate, Advanced
   - 2 chế độ chơi: Pick (chọn đáp án) & Input (gõ đáp án)
   - Bao gồm: Daily words, Greetings, Food & Drink, Idioms, Phrasal Verbs, Business, Literary, Common Phrases
3. **Blitz Mode**: Trò chơi tốc độ cao, trả lời nhanh chóng
4. **Gauntlet Mode**: Chế độ thử thách với 3 độ khó

### Theo Dõi Tiến Độ
- Xem thống kê học tập chi tiết
- Theo dõi số từ đã học vs chưa học
- Lưu những từ yêu thích để ôn tập

### Thành Tích
- Hệ thống huy hiệu (achievements)
- Động lực học tập thông qua mục tiêu

### Tùy Chỉnh
- Chế độ tối (dark mode) / sáng (light mode) / tự động
- Lưu trữ dữ liệu cấp độ người dùng

## Nội Dung Học

### Vocabulary Categories
- **Beginner**: Everyday words, Greetings & Social, Food & Drink, Common Phrases
- **Intermediate**: Idioms, Phrasal Verbs, Useful Phrases
- **Advanced**: Business & Finance, Literary & Academic, Advanced Phrases

### Vocabulary Formats
- Từ đơn (Single words)
- Cụm từ (Phrases)
- Thành ngữ (Idioms)
- Slang hiện đại (Modern Slang)

Tất cả có ví dụ tiếng Anh/Việt để bạn hiểu rõ ngữ cảnh sử dụng.

## Bắt Đầu

### Yêu Cầu Hệ Thống
- Node.js 18+
- npm 9+

### Cài Đặt

```bash
# Clone repository
git clone https://github.com/luongwnv/eng-kudo.git
cd eng-kudo

# Cài đặt dependencies
npm install

# Chạy dev server
npm run dev

# Build cho production
npm run build
```

### Chạy Ứng Dụng

**Development:**
```bash
npm run dev
```
Truy cập: `http://localhost:5173`

**Production Build:**
```bash
npm run build
npm run preview
```

## Kiến Trúc

### Tech Stack
- **Language**: TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS + PostCSS
- **Package Manager**: npm
- **Icons**: Lucide

### Cấu Trúc Thư Mục
```
src/
├── app/              # Pages (Flashcard, Vocabulary, Games, etc.)
├── features/         # Feature modules (Flashcard, Vocabulary, Progress, etc.)
├── core/             # Core utilities (Router, Storage, Render Engine)
├── shared/           # Shared components, utilities, types
└── styles/           # Global styles
```

## Cách Sử Dụng

### Học Flashcards
1. Chọn "Flashcards" từ menu
2. Chọn bộ lọc: Unlearned (Chưa học), Learned (Đã học), Starred (Yêu thích), All
3. Click vào thẻ để lật xem nghĩa tiếng Việt
4. Click biểu tượng sao để đánh dấu yêu thích
5. Click biểu tượng check để đánh dấu đã học

### Chơi Vocabulary Game
1. Chọn "Vocabulary" từ menu
2. Chọn cấp độ: Beginner, Intermediate, hoặc Advanced
3. Chọn chủ đề (Topics)
4. Chọn chế độ chơi:
   - **Pick**: Chọn đáp án đúng từ các lựa chọn
   - **Input**: Gõ đáp án đúng
5. Nhấn "Start" để bắt đầu

### Chơi Blitz & Gauntlet
1. Chọn "Blitz" hoặc "Gauntlet" từ menu
2. Chọn thời gian/độ khó (nếu có)
3. Trả lời các câu hỏi nhanh chóng
4. Xem kết quả cuối cùng

## Giao Diện

Ứng dụng được thiết kế:
- **Responsive**: Hoạt động tốt trên mobile, tablet và desktop
- **Dark Mode**: Hỗ trợ chế độ tối để bảo vệ mắt
- **Keyboard Shortcuts**: Dùng phím mũi tên để điều hướng nhanh

### Keyboard Shortcuts (Flashcards)
- **→ / Space**: Thẻ tiếp theo
- **←**: Thẻ trước đó
- **Enter / ↑ / ↓**: Lật thẻ

## Lưu Trữ Dữ Liệu

Ứng dụng lưu trữ dữ liệu người dùng cấp độ trình duyệt bằng:
- **ChromeStorage API** (cho Chrome Extensions)
- **LocalStorage** (cho web)

Dữ liệu được lưu bao gồm:
- Từ đã học
- Từ yêu thích
- Thống kê tiến độ
- Tùy chỉnh (theme, language)

## Dữ Liệu Học

### Flashcard Database
- File: `public/works.csv`
- Chứa: 95+ từ vựng, cụm từ, slang tiếng Anh
- Định dạng: Word, Vietnamese meaning

### Vocabulary Data
- Vị trí: `src/features/Vocabulary/data/`
- Các tập tin:
  - `beginner/`: Từ cơ bản, cụm từ thường dùng
  - `intermediate/`: Thành ngữ, phrasal verbs
  - `advanced/`: Từ nâng cao, cụm từ phức tạp

Mỗi từ bao gồm:
- Từ/cụm từ
- Định nghĩa tiếng Anh
- Loại từ (verb, noun, phrase, idiom, etc.)
- Ví dụ tiếng Anh
- Ví dụ tiếng Việt
- Từ đồng nghĩa
- Từ trái nghĩa (nếu có)

## Nâng Cao

### Thêm Từ Mới
1. Mở file `public/works.csv`
2. Thêm dòng mới: `word,vietnamese meaning`
3. Thêm ví dụ vào `src/features/Flashcard/data/examples-map.ts` (optional)

### Tùy Chỉnh Themes
- Sửa màu sắc trong `tailwind.config.js`
- Các CSS variables được định nghĩa trong `src/styles/main.css`

## Đóng Góp

Bạn có thể đóng góp bằng cách:
1. Fork repository
2. Tạo branch mới cho feature (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Mở Pull Request

## License

Dự án này được cấp phép dưới MIT License - xem file [LICENSE](LICENSE) để chi tiết.

## Hỗ Trợ

Nếu bạn gặp vấn đề hoặc có đề xuất, vui lòng:
- Mở [GitHub Issues](https://github.com/luongwnv/eng-kudo/issues)
- Liên hệ tác giả

## Mục Tiêu

eng-kudo được tạo ra để:
- Giúp học viên học tiếng Anh hiệu quả
- Kết hợp giữa lý thuyết và thực hành
- Tạo môi trường học tập vui vẻ
- Theo dõi tiến độ học tập
- Hỗ trợ cả từ vựng cơ bản lẫn nâng cao

---

**Happy Learning!**

Tập trung, kiên trì và bạn sẽ thành thạo tiếng Anh!
