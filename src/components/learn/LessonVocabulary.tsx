import '../../styles/components/learn/_lesson-vocabulary.scss';

interface VocabularyItem {
  term: string;
  definition: string;
}

interface LessonVocabularyProps {
  items: VocabularyItem[];
}

export default function LessonVocabulary({ items }: LessonVocabularyProps) {
  return (
    <div className="lesson-vocabulary">
      <h2 className="lesson-vocabulary__title">Từ vựng & Khái niệm</h2>
      <div className="lesson-vocabulary__list">
        {items.map((item, index) => (
          <div key={index} className="lesson-vocabulary__item">
            <div className="lesson-vocabulary__term">{item.term}</div>
            <div className="lesson-vocabulary__definition">{item.definition}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
