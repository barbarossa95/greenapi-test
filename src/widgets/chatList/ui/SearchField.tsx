import {Input} from 'antd';
import {Search} from 'lucide-react';
import {useTranslation} from 'react-i18next';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchField = ({value, onChange}: SearchFieldProps) => {
  const {t} = useTranslation();

  return (
    <Input
      allowClear
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={t('search-chats')}
      aria-label={t('search-chats')}
      prefix={<Search size={14} />}
    />
  );
};
