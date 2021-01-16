const {Sprint, Story} = require('../entities');

describe('Sprint', () => {
    it('ストーリーが正しい', () => {
        const sprint = new Sprint(1);
        expect(sprint.id).toBe(1);
        expect(sprint.stories).toHaveLength(0);

        const story = new Story('環境構築', '開発環境をセットアップする');
        sprint.addStory(story);
        expect(sprint.stories).toHaveLength(1);
    });

    it('アサイン状況を正しく取得できる', () => {
        const sprint = new Sprint(1);

        const story1 = new Story('環境構築', '開発環境をセットアップする', 3, '井上');
        sprint.addStory(story1);
        const story2 = new Story('サンプル開発', 'サンプルコードを書く', 2, '山田');
        sprint.addStory(story2);
        const story3 = new Story('ユニットテスト', 'テストコードを書く', 1, '町田');
        sprint.addStory(story3);
        const story4 = new Story('E2E', 'E2Eテストを作成する', 2, '山田');
        sprint.addStory(story4);
        // 人別に、ポイント合計の降順でソートされる
        expect(sprint.assignment).toEqual([
            ['山田', 4],
            ['井上', 3],
            ['町田', 1],
        ]);
    });
});

describe('Story', () => {
    it('未アサインは開始不可', () => {
        const story = new Story('環境構築', '開発環境をセットアップする', 3, null);
        expect(story.canBeStarted).toBe(false);
    });
    it('ポイントを振ってない場合は開始不可', () => {
        const story = new Story('環境構築', '開発環境をセットアップする', 0, '井上');
        expect(story.canBeStarted).toBe(false);
    });
    it('ポイントもアサインも入ってない場合は開始不可', () => {
        const story = new Story('環境構築', '開発環境をセットアップする', 0, null);
        expect(story.canBeStarted).toBe(false);
    });
    it('ポイントもアサインも入っている場合は開始可', () => {
        const story = new Story('環境構築', '開発環境をセットアップする', 3, '井上');
        expect(story.canBeStarted).toBe(true);
    });
});
