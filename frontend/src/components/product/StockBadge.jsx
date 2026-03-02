import Badge from '../ui/extended/Badge';
import { getStockStatus } from '../../utils/stockHelpers';

export default function StockBadge({ stock, size = 'sm' }) {
  const status = getStockStatus(stock);
  return <Badge label={status.label} color={status.color} dot size={size} />;
}
