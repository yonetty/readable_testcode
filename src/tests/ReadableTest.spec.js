const {Sprint, Story} = require('../entities');

const defaults = (val, defaultVal) => val === undefined ? defaultVal : val;

const aSprint = ({id, description} = {}) =>
    new Sprint(
        defaults(id, 1),
        defaults(description, 'any')
    );

const aStory = ({title, description, point, asignee} = {}) =>
    new Story(
        defaults(title, 'any'),
        defaults(description, 'any'),
        defaults(point, 0),
        defaults(asignee, 'any')
    );

describe('Sprint', () => {
    let sut;

    beforeEach(() => {
        sut = aSprint();
    });

    it('初期状態が正しい', () => {
        // Assert
        expect(sut.id).toBe(1);
        expect(sut.stories).toHaveLength(0);
    });

    it('ストーリーを追加できる', () => {
        // Arrange
        const story = new Story('環境構築', '開発環境をセットアップする');
        // Act
        sut.addStory(story);
        // Assert
        expect(sut.stories).toHaveLength(1);
    });

    it('アサイン状況は人別にポイントが表示され、ポイント合計の降順でソートされる', () => {
        // Arrange
        const [pt1, pt2, pt3, pt4] = [3, 2, 1, 2];
        const story1 = aStory({point: pt1, asignee: '井上'});
        const story2 = aStory({point: pt2, asignee: '山田'});
        const story3 = aStory({point: pt3, asignee: '町田'});
        const story4 = aStory({point: pt4, asignee: '山田'});
        [story1, story2, story3, story4].forEach(s => sut.addStory(s));
        // Act
        const assignment = sut.assignment;
        // Assert
        expect(assignment).toEqual([
            ['山田', (pt2 + pt4)], //4ポイント
            ['井上', pt1], // 3ポイント
            ['町田', pt3], // 1ポイント
        ]);
    });
});

describe('Story', () => {
    test.each`
        point | asignee  | expected | desc
         ${3} | ${null}  | ${false} | ${'未アサインは開始不可'}
         ${0} | ${'山田'} | ${false} | ${'ポイントを振ってない場合は開始不可'}
         ${0} | ${null}  | ${false} | ${'ポイントもアサインも入ってない場合は開始不可'}
         ${3} | ${'山田'} | ${true}  | ${'ポイントもアサインも入っている場合は開始可'}
    `("開始可能か: $desc", ({point, asignee, expected}) => {
        // Arrange
        const sut = aStory({point, asignee});
        // Act
        const canBeStarted = sut.canBeStarted;
        // Assert
        expect(canBeStarted).toBe(expected);
    });
});

